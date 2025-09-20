import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool } from "../config/db.js";
import { sendMail } from "../utils/mail.js";

// HELPER FUNCTIONS
const signAccess = (payload) => jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_TTL || '1h' });
const signRefresh = (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: `${process.env.REFRESH_TOKEN_TTL_DAYS || 14}d` });
const sha256 = (str) => crypto.createHash('sha256').update(str).digest('hex');
const setRefreshCookie = (res, token) => {
  res.cookie('rt_admin', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: '/api/auth/admin',
    maxAge: (parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '14', 10)) * 24 * 60 * 60 * 1000,
  });
};

// EMAIL TEMPLATES
const generateLoginAlertEmailTemplate = (firstName, loginTime, ipAddress, userAgent) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LearningVault - Security Alert</title>
    <style>
        body { margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08); }
        .header { background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%); padding: 32px 40px; text-align: center; }
        .logo { font-size: 28px; font-weight: 300; color: white; text-decoration: none; }
        .logo .vault { font-weight: 500; }
        .content { padding: 40px; text-align: left; }
        .title { font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 16px; }
        .subtitle { font-size: 16px; color: #64748b; margin-bottom: 32px; line-height: 1.5; }
        .details-table { width: 100%; border-collapse: collapse; margin: 24px 0; }
        .details-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #334155; }
        .details-table td:first-child { font-weight: 600; color: #475569; width: 120px; }
        .info-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin-top: 32px; border-radius: 0 8px 8px 0; }
        .info-box p { margin: 0; color: #0f172a; font-size: 14px; line-height: 1.5; }
        .footer { background: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 0 0 8px; color: #64748b; font-size: 14px; }
        .footer a { color: #3b82f6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Learning<span class="vault">Vault</span></div>
        </div>
        <div class="content">
            <h1 class="title">Security Alert: New Login to Your Account</h1>
            <p class="subtitle">Hi ${firstName}, we're letting you know that a login to your account just occurred. Here are the details:</p>
            <table class="details-table">
                <tr><td>Time:</td><td>${loginTime}</td></tr>
                <tr><td>IP Address:</td><td>${ipAddress}</td></tr>
                <tr><td>Device:</td><td>${userAgent}</td></tr>
            </table>
            <div class="info-box">
                <p><strong>Wasn't you?</strong> If you don't recognize this activity, please reset your password immediately and contact our support team.</p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated security notification.</p>
            <p><a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
  `;
};

const generatePasswordResetEmailTemplate = (firstName, resetUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LearningVault - Password Reset Request</title>
    <style>
        body { margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px 40px; text-align: center; }
        .logo { font-size: 28px; font-weight: 300; color: white; text-decoration: none; }
        .logo .vault { font-weight: 500; }
        .content { padding: 40px; text-align: center; }
        .title { font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 16px; }
        .subtitle { font-size: 16px; color: #64748b; margin-bottom: 32px; line-height: 1.5; }
        .button { display: inline-block; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 500; font-size: 16px; margin: 24px 0; }
        .info-box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; margin-top: 32px; border-radius: 0 8px 8px 0; text-align: left;}
        .info-box p { margin: 0; color: #0f172a; font-size: 14px; line-height: 1.5; }
        .footer { background: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 0 0 8px; color: #64748b; font-size: 14px; }
        .footer a { color: #3b82f6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Learning<span class="vault">Vault</span></div>
        </div>
        <div class="content">
            <h1 class="title">Password Reset Request</h1>
            <p class="subtitle">Hi ${firstName}, we received a request to reset your password. Click the button below to set a new one:</p>
            <a href="${resetUrl}" class="button">Reset Your Password</a>
            <div class="info-box">
                <p><strong>Heads up:</strong> This link is valid for only 10 minutes. If you did not request a password reset, you can safely ignore this email.</p>
            </div>
            <p style="color: #64748b; font-size: 12px; margin-top: 32px; line-height: 1.5;">
                If the button doesn't work, copy and paste this URL into your browser:<br>
                <a href="${resetUrl}" style="color: #3b82f6; text-decoration: underline; word-break: break-all;">${resetUrl}</a>
            </p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
            <p><a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
  `;
};

const generatePasswordResetSuccessEmailTemplate = (firstName, loginUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LearningVault - Password Changed Successfully</title>
    <style>
        body { margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px 40px; text-align: center; }
        .logo { font-size: 28px; font-weight: 300; color: white; text-decoration: none; }
        .logo .vault { font-weight: 500; }
        .content { padding: 40px; text-align: center; }
        .title { font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 16px; }
        .subtitle { font-size: 16px; color: #64748b; margin-bottom: 32px; line-height: 1.5; }
        .button { display: inline-block; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 500; font-size: 16px; margin: 24px 0; }
        .info-box { background: #fff1f2; border-left: 4px solid #ef4444; padding: 20px; margin-top: 32px; border-radius: 0 8px 8px 0; text-align: left; }
        .info-box p { margin: 0; color: #0f172a; font-size: 14px; line-height: 1.5; }
        .footer { background: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 0 0 8px; color: #64748b; font-size: 14px; }
        .footer a { color: #3b82f6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Learning<span class="vault">Vault</span></div>
        </div>
        <div class="content">
            <h1 class="title">Security Alert: Your Password Was Changed</h1>
            <p class="subtitle">Hi ${firstName}, this is a confirmation that the password for your LearningVault account has been successfully changed.</p>
            <a href="${loginUrl}" class="button">Login to Your Account</a>
            <div class="info-box">
                <p><strong>Didn't make this change?</strong> If you did not request a password change, please contact our support team immediately to secure your account.</p>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from an unmonitored address. Please do not reply.</p>
            <p><a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
  `;
};
// CONTROLLER LOGIC
export const adminLogin = async (req, res) => {
  const { email, password } = req.body || {};
  try {
    const { rows } = await pool.query('SELECT * FROM studio_users WHERE email=$1', [email]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
    
    const admin = rows[0];
    if (!admin.is_active) return res.status(403).json({ message: 'Your account is deactivated.' });

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccess({ id: admin.id, role: admin.role });
    const refreshToken = signRefresh({ id: admin.id });
    const decoded = jwt.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);
    const tokenHash = sha256(refreshToken);

    await pool.query(
      `INSERT INTO studio_refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [admin.id, tokenHash, expiresAt]
    );

    setRefreshCookie(res, refreshToken);

    // Send login notification email
    try {
      const loginTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const htmlTemplate = generateLoginAlertEmailTemplate(admin.first_name, loginTime, ipAddress, userAgent);
      await sendMail(admin.email, 'Security Alert: New Login to Your Studio Account', htmlTemplate);
    } catch (mailError) {
      console.error("Failed to send login notification email:", mailError);
    }

    res.json({
      message: 'Admin login successful',
      accessToken,
      user: {
        id: admin.id,
        name: `${admin.first_name} ${admin.last_name}`,
        email: admin.email,
        role: admin.role,
      }
    });
  } catch (err) {
    console.error('Admin Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const adminRefresh = async (req, res) => {
  const token = req.cookies?.rt_admin;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const tokenHash = sha256(token);
    const { rows } = await pool.query(
      `SELECT * FROM studio_refresh_tokens WHERE token_hash=$1 AND revoked=false AND expires_at > NOW()`,
      [tokenHash]
    );
    if (rows.length === 0) return res.status(401).json({ message: 'Refresh token invalid or expired' });

    const userResult = await pool.query('SELECT role FROM studio_users WHERE id=$1', [payload.id]);
    if (userResult.rows.length === 0) return res.status(401).json({ message: 'User not found' });
    
    const userRole = userResult.rows[0].role;
    
    await pool.query('UPDATE studio_refresh_tokens SET revoked=true WHERE token_hash=$1', [tokenHash]);
    const accessToken = signAccess({ id: payload.id, role: userRole });
    const newRefresh = signRefresh({ id: payload.id });
    const decoded = jwt.decode(newRefresh);
    const expiresAt = new Date(decoded.exp * 1000);
    const newHash = sha256(newRefresh);

    await pool.query(
      `INSERT INTO studio_refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [payload.id, newHash, expiresAt]
    );

    setRefreshCookie(res, newRefresh);
    res.json({ accessToken });
  } catch (err) {
    console.error('Admin Refresh error:', err);
    res.clearCookie('rt_admin', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'None', domain: process.env.COOKIE_DOMAIN || undefined, path: '/api/auth/admin' });
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const adminLogout = async (req, res) => {
  try {
    const token = req.cookies?.rt_admin;
    if (token) {
      const tokenHash = sha256(token);
      await pool.query('UPDATE studio_refresh_tokens SET revoked=true WHERE token_hash=$1', [tokenHash]);
    }
  } catch (e) {
    // ignore
  } finally {
    res.clearCookie('rt_admin', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'None', domain: process.env.COOKIE_DOMAIN || undefined, path: '/api/auth/admin' });
    res.json({ message: 'Admin logged out' });
  }
};

export const adminMe = async (req, res) => {
  // Thanks to the middleware, req.user is already available
  res.json({ ok: true, user: req.user });
};

export const adminForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const { rows } = await pool.query('SELECT id, email, first_name FROM studio_users WHERE email=$1', [email]);
        if (rows.length > 0) {
            const user = rows[0];
            const resetToken = crypto.randomBytes(32).toString('hex');
            const passwordResetToken = sha256(resetToken);
            const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

            await pool.query(
                'UPDATE studio_users SET password_reset_token=$1, password_reset_expires=$2 WHERE id=$3',
                [passwordResetToken, passwordResetExpires, user.id]
            );

            const resetUrl = `${process.env.STUDIO_CLIENT_URL}/reset-password?token=${resetToken}`;
            const htmlTemplate = generatePasswordResetEmailTemplate(user.first_name, resetUrl);
            await sendMail(user.email, 'Reset Your Studio Account Password', htmlTemplate);
        }
        res.json({ message: 'If a studio account with that email exists, a password reset link has been sent.' });
    } catch (err) {
        console.error('Admin Forgot Password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const adminResetPassword = async (req, res) => {
    const { token, password, confirmPassword } = req.body;
    if (!token || !password || !confirmPassword || password !== confirmPassword) {
        return res.status(400).json({ message: 'Invalid input.' });
    }

    const hashedToken = sha256(token);
    try {
        const { rows } = await pool.query(
            'SELECT id, first_name, email FROM studio_users WHERE password_reset_token=$1 AND password_reset_expires > NOW()',
            [hashedToken]
        );
        if (rows.length === 0) return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        
        const user = rows[0];
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'UPDATE studio_users SET password=$1, password_reset_token=NULL, password_reset_expires=NULL WHERE id=$2',
            [hashedPassword, user.id]
        );
        await pool.query('UPDATE studio_refresh_tokens SET revoked=true WHERE user_id=$1', [user.id]);

        const loginUrl = `${process.env.STUDIO_CLIENT_URL}/login`;
        const htmlTemplate = generatePasswordResetSuccessEmailTemplate(user.first_name, loginUrl);
        await sendMail(user.email, 'Security Alert: Your Studio Password Has Been Changed', htmlTemplate);

        res.json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('Admin Reset Password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};