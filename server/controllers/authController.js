import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool } from "../config/db.js";

// helpers
const signAccess = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL || '15m',
  });

const signRefresh = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: `${process.env.REFRESH_TOKEN_TTL_DAYS || 7}d`,
  });

// hash a string with sha256 (hex)
const sha256 = (str) => crypto.createHash('sha256').update(str).digest('hex');

// set refresh cookie
const setRefreshCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('rt', token, {
    httpOnly: true,
    secure: true,               // must be true in production (HTTPS)
    sameSite: 'None',           // cross-site (api.<domain> <-> <domain>)
    domain: process.env.COOKIE_DOMAIN || undefined,  // .learningvault.in
    path: '/api/auth',
    maxAge: (parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '7', 10)) * 24 * 60 * 60 * 1000,
  });
};

export const login = async (req, res) => {
  const { email, password, rememberMe } = req.body || {};
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const user = rows[0];

    if (!user.is_verified) {
      return res.status(403).json({ message: 'Please verify your account before login.' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid email or password' });

    // Access token (short-lived)
    const accessToken = signAccess({ id: user.id, email: user.email });

    // If rememberMe, issue refresh token cookie and store hash in DB
    if (rememberMe) {
      const refreshToken = signRefresh({ id: user.id, email: user.email });
      const decoded = jwt.decode(refreshToken);
      const expiresAt = new Date(decoded.exp * 1000);
      const tokenHash = sha256(refreshToken);

      await pool.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, tokenHash, expiresAt]
      );

      setRefreshCookie(res, refreshToken);
    } else {
      // ensure any existing cookie is cleared when rememberMe is false
      res.clearCookie('rt', {
        httpOnly: true, secure: true, sameSite: 'None',
        domain: process.env.COOKIE_DOMAIN || undefined, path: '/api/auth'
      });
    }

    res.json({
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const refresh = async (req, res) => {
  const token = req.cookies?.rt;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    // Verify JWT signature & expiry
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Check token exists & not revoked in DB
    const tokenHash = sha256(token);
    const { rows } = await pool.query(
      `SELECT * FROM refresh_tokens
       WHERE token_hash=$1 AND revoked=false AND expires_at > NOW()`,
      [tokenHash]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Refresh token invalid or expired' });
    }

    // Rotate refresh token: revoke old, issue new
    await pool.query('UPDATE refresh_tokens SET revoked=true WHERE token_hash=$1', [tokenHash]);

    const accessToken = signAccess({ id: payload.id, email: payload.email });
    const newRefresh = signRefresh({ id: payload.id, email: payload.email });
    const decoded = jwt.decode(newRefresh);
    const expiresAt = new Date(decoded.exp * 1000);
    const newHash = sha256(newRefresh);

    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [payload.id, newHash, expiresAt]
    );

    setRefreshCookie(res, newRefresh);
    res.json({ accessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    // clear bad cookie
    res.clearCookie('rt', {
      httpOnly: true, secure: true, sameSite: 'None',
      domain: process.env.COOKIE_DOMAIN || undefined, path: '/api/auth'
    });
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.rt;
    if (token) {
      const tokenHash = sha256(token);
      await pool.query('UPDATE refresh_tokens SET revoked=true WHERE token_hash=$1', [tokenHash]);
    }
  } catch (e) {
    // noop
  } finally {
    res.clearCookie('rt', {
      httpOnly: true, secure: true, sameSite: 'None',
      domain: process.env.COOKIE_DOMAIN || undefined, path: '/api/auth'
    });
    res.json({ message: 'Logged out' });
  }
};

// Optional helper to validate access token on the client
export const me = async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token' });

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Fetch user from database
    const result = await db.query(
      'SELECT id, first_name, last_name, email FROM users WHERE id = $1',
      [payload.id]
    );

    const user = result.rows[0];

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ ok: true, user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
};