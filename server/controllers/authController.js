import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool } from "../config/db.js";
import { sendMail } from "../utils/mail.js";


// helpers
const signAccess = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_TTL || '50m',
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
    const result = await pool.query(
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


// Function to generate OTP email HTML template
const generateOTPEmailTemplate = (firstName, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LearningVault - Your Login Verification Code</title>
    <style>
        /* Base styles for email compatibility */
        body {
            margin: 0;
            padding: 20px;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
        }
        
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            padding: 32px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
        }
        
        .logo {
            font-size: 28px;
            font-weight: 300;
            color: white;
            text-decoration: none;
            position: relative;
            z-index: 1;
            letter-spacing: -0.5px;
        }
        
        .logo .vault {
            font-weight: 500;
        }
        
        .content {
            padding: 40px;
            text-align: center;
        }
        
        .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        
        .icon svg {
            width: 36px;
            height: 36px;
            color: #3b82f6;
        }
        
        .icon::after {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            z-index: -1;
            opacity: 0.1;
        }
        
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 16px;
            line-height: 1.3;
        }
        
        .subtitle {
            font-size: 16px;
            color: #64748b;
            margin-bottom: 32px;
            line-height: 1.5;
        }
        
        .otp-code {
            font-size: 32px;
            font-weight: 700;
            color: #1e293b;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            padding: 20px 32px;
            border-radius: 12px;
            letter-spacing: 4px;
            margin: 32px 0;
            border: 2px dashed #3b82f6;
        }
        
        .info-box {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 32px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .info-box p {
            margin: 0;
            color: #0f172a;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .footer {
            background: #f8fafc;
            padding: 32px 40px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
            margin: 0 0 8px;
            color: #64748b;
            font-size: 14px;
        }
        
        .footer a {
            color: #3b82f6;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Learning<span class="vault">Vault</span></div>
        </div>
        <div class="content">
            <h1 class="title">Your Verification Code</h1>
            <p class="subtitle">Hi ${firstName}, to complete your registration, please enter this verification code:</p>
            
            <div class="otp-code">${otp}</div>
            
            <div class="info-box">
                <p><strong>Important:</strong> This code will expire in 5 minutes. Don't share this code with anyone for your security.</p>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-top: 32px;">
                If you didn't create an account with LearningVault, please ignore this email or contact our support team.
            </p>
        </div>
        <div class="footer">
            <p>This email was sent to you because you created an account with LearningVault.</p>
            <p><a href="#">Need help?</a> | <a href="#">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
  `;
};

export const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    termsAccepted,
    subscribeUpdates,
  } = req.body;

  try {
    // Validate
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !termsAccepted
    )
      return res.status(400).json({
        message: "All required fields must be filled and terms accepted.",
      });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });

    const userExist = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (userExist.rows.length > 0)
      return res.status(400).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `INSERT INTO users 
      (first_name,last_name,email,password,terms_accepted,subscribe_updates,otp,otp_expires) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        termsAccepted,
        subscribeUpdates || false,
        otp,
        otpExpires,
      ]
    );

    // Send OTP email with professional template
    const htmlTemplate = generateOTPEmailTemplate(firstName, otp);
    await sendMail(
      email,
      "Your Verification Code - LearningVault",
      htmlTemplate
    );

    res.status(201).json({ message: "User registered. OTP sent to email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const result = await pool.query(
      "SELECT first_name, otp, otp_expires, is_verified FROM users WHERE email=$1",
      [email]
    );
    if (result.rows.length === 0)
      return res.status(400).json({ message: "User not found." });

    const user = result.rows[0];
    if (user.is_verified)
      return res.status(400).json({ message: "User already verified." });
    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP." });
    if (new Date() > user.otp_expires)
      return res.status(400).json({ message: "OTP expired." });

    // ✅ Update user to verified
    await pool.query(
      "UPDATE users SET is_verified=true, otp=NULL, otp_expires=NULL WHERE email=$1",
      [email]
    );

    // ✅ Send account activation mail
    const htmlTemplate = `

      <!DOCTYPE html>
      <html lang="en">
      <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>LearningVault - Your Login Verification Code</title>
    <style>
      /* Base styles for email compatibility */
      body {
        margin: 0;
        padding: 20px;
        background-color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, sans-serif;
      }

      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
      }

      .header {
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        padding: 32px 40px;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      .header::before {
        content: "";
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
          circle,
          rgba(255, 255, 255, 0.1) 0%,
          transparent 70%
        );
      }

      .logo {
        font-size: 28px;
        font-weight: 300;
        color: white;
        text-decoration: none;
        position: relative;
        z-index: 1;
        letter-spacing: -0.5px;
      }

      .logo .vault {
        font-weight: 500;
      }

      .content {
        padding: 40px;
        text-align: center;
      }

      .icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 24px;
        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }

      .icon svg {
        width: 36px;
        height: 36px;
        color: #3b82f6;
      }

      .icon::after {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        z-index: -1;
        opacity: 0.1;
      }

      .title {
        font-size: 24px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 16px;
        line-height: 1.3;
      }

      .subtitle {
        font-size: 16px;
        color: #64748b;
        margin-bottom: 32px;
        line-height: 1.5;
      }

      .info-box {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border-left: 4px solid #3b82f6;
        padding: 20px;
        margin: 32px 0;
        border-radius: 0 8px 8px 0;
      }

      .info-box p {
        margin: 0;
        color: #0f172a;
        font-size: 14px;
        line-height: 1.5;
      }

      .footer {
        background: #f8fafc;
        padding: 32px 40px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
      }

      .footer p {
        margin: 0 0 8px;
        color: #64748b;
        font-size: 14px;
      }

      .footer a {
        color: #3b82f6;
        text-decoration: none;
      }

      .button {
        display: inline-block;
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        color: white !important;
        text-decoration: none;
        padding: 14px 32px;
        border-radius: 12px;
        font-weight: 500;
        font-size: 16px;
        margin: 24px 0;
        transition: all 0.3s ease;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <div class="logo">Learning<span class="vault">Vault</span></div>
      </div>
      <div class="content">
        <h1 class="title">Welcome to LearningVault!</h1>
        <p class="subtitle">
          Hi ${user.first_name}, Your account has been successfully activated. You're
          all set to begin your learning journey.
        </p>

        <a class="button">Start Learning</a>

        <div class="info-box">
          <p>
            <strong>What's next?</strong> Explore our course catalog, set up
            your learning goals, and join our community of 10,000+ successful
            learners.
          </p>
        </div>

        <p style="color: #64748b; font-size: 14px; margin-top: 32px">
          Get started with our recommended beginner courses or browse by
          category to find what interests you most.
        </p>
      </div>
      <div class="footer">
        <p>
          Ready to transform your career? We're here to support you every step
          of the way.
        </p>
        <p><a href="#">Browse Courses</a> | <a href="#">Join Community</a> | <a href="#">Get Support</a></p>
      </div>
    </div>
  </body>
</html>

    `;

    await sendMail(
      email,
      "Your Account is Activated - LearningVault",
      htmlTemplate
    );

    res.json({ message: "Email verified successfully. Account activated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0)
      return res.status(400).json({ message: "User not found." });

    const user = result.rows[0];

    if (user.is_verified)
      return res.status(400).json({ message: "User already verified." });

    // Generate new OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await pool.query("UPDATE users SET otp=$1, otp_expires=$2 WHERE email=$3", [
      otp,
      otpExpires,
      email,
    ]);

    // Send OTP email
    const htmlTemplate = generateOTPEmailTemplate(user.first_name, otp);
    await sendMail(
      email,
      "Your Verification Code - LearningVault",
      htmlTemplate
    );

    res.json({ message: "OTP resent successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================================
// NEW CODE FOR PASSWORD RESET STARTS HERE
// ===============================================

// Function to generate Password Reset email HTML template
const generatePasswordResetEmailTemplate = (firstName, resetUrl) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LearningVault - Password Reset Request</title>
      <style>
          /* Re-using styles from the OTP template for consistency */
          body { margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
          .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08); }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px 40px; text-align: center; }
          .logo { font-size: 28px; font-weight: 300; color: white; text-decoration: none; letter-spacing: -0.5px; }
          .logo .vault { font-weight: 500; }
          .content { padding: 40px; text-align: center; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 16px; }
          .subtitle { font-size: 16px; color: #64748b; margin-bottom: 32px; line-height: 1.5; }
          .button { display: inline-block; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 500; font-size: 16px; margin: 24px 0; transition: all 0.3s ease; }
          .info-box { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-left: 4px solid #3b82f6; padding: 20px; margin-top: 32px; border-radius: 0 8px 8px 0; text-align: left; }
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
              
              <p style="color: #64748b; font-size: 14px; margin-top: 32px;">
                  If the button above doesn't work, copy and paste this URL into your browser:<br>
                  <a href="${resetUrl}" style="color: #3b82f6; text-decoration: underline; word-break: break-all;">${resetUrl}</a>
              </p>
          </div>
          <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p><a href="#">Need help?</a> | <a href="#">Contact Support</a></p>
          </div>
      </div>
  </body>
  </html>
  `;
};

/**
 * @desc    Request password reset link
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
  
    try {
      const { rows } = await pool.query('SELECT id, email, first_name FROM users WHERE email=$1', [email]);
  
      if (rows.length === 0) {
        // To prevent user enumeration, send a generic success message even if the user doesn't exist.
        return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
      }
  
      const user = rows[0];
  
      // Generate a random, unguessable token
      const resetToken = crypto.randomBytes(32).toString('hex');
      
      // Hash the token for database storage
      const passwordResetToken = sha256(resetToken);
      
      // Set an expiration time (10 minutes from now)
      const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  
      // Update the user record in the database
      await pool.query(
        'UPDATE users SET password_reset_token=$1, password_reset_expires=$2 WHERE id=$3',
        [passwordResetToken, passwordResetExpires, user.id]
      );
  
      // Create the full reset URL for the email (ensure CLIENT_URL is in your .env file)
      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
      
      // Send the email
      const htmlTemplate = generatePasswordResetEmailTemplate(user.first_name, resetUrl);
      await sendMail(
        user.email,
        'Your Password Reset Link - LearningVault',
        htmlTemplate
      );
  
      res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  
    } catch (err) {
      console.error('Forgot Password error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  };


  // Function to generate Password Reset Success email HTML template
const generatePasswordResetSuccessEmailTemplate = (firstName, loginUrl) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LearningVault - Password Changed Successfully</title>
      <style>
          /* Re-using styles for consistency */
          body { margin: 0; padding: 20px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
          .email-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08); }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px 40px; text-align: center; }
          .logo { font-size: 28px; font-weight: 300; color: white; text-decoration: none; letter-spacing: -0.5px; }
          .logo .vault { font-weight: 500; }
          .content { padding: 40px; text-align: center; }
          .title { font-size: 24px; font-weight: 600; color: #1e293b; margin-bottom: 16px; }
          .subtitle { font-size: 16px; color: #64748b; margin-bottom: 32px; line-height: 1.5; }
          .button { display: inline-block; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 500; font-size: 16px; margin: 24px 0; transition: all 0.3s ease; }
          .info-box { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); border-left: 4px solid #ef4444; padding: 20px; margin-top: 32px; border-radius: 0 8px 8px 0; text-align: left; }
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
              <p><a href="#">Contact Support</a> | <a href="#">Privacy Policy</a></p>
          </div>
      </div>
  </body>
  </html>
  `;
};
  
/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
    const { token, password, confirmPassword } = req.body;
  
    // 1. Validate inputs
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
  
    // 2. Hash the incoming token to find the user
    const hashedToken = sha256(token);
  
    try {
      // Find user by token and get their details for the email
      const { rows } = await pool.query(
        'SELECT id, first_name, email FROM users WHERE password_reset_token=$1 AND password_reset_expires > NOW()',
        [hashedToken]
      );
  
      if (rows.length === 0) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
      }
  
      const user = rows[0];
  
      // 3. Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // 4. Update the password and clear the reset token fields to prevent reuse
      await pool.query(
        'UPDATE users SET password=$1, password_reset_token=NULL, password_reset_expires=NULL WHERE id=$2',
        [hashedPassword, user.id]
      );
      
      // 5. (Security Best Practice) Invalidate all existing refresh tokens
      await pool.query('UPDATE refresh_tokens SET revoked=true WHERE user_id=$1', [user.id]);
  
      // 6. (NEW) Send a confirmation email to the user
      try {
        const loginUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`;
        const htmlTemplate = generatePasswordResetSuccessEmailTemplate(user.first_name, loginUrl);
        await sendMail(
            user.email,
            'Security Alert: Your LearningVault Password Has Been Changed',
            htmlTemplate
        );
      } catch (mailError) {
        // If email fails, log it but don't fail the API request
        console.error('Failed to send password reset confirmation email:', mailError);
      }

      res.json({ message: 'Password has been reset successfully.' });
  
    } catch (err){
      console.error('Reset Password error:', err);
      res.status(500).json({ message: 'Server error' });
    }
};