import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendMail } from '../utils/mail.js';

// Function to generate Account Activated email HTML template
const generateAccountActivatedEmailTemplate = (firstName) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LearningVault - Welcome to Your Learning Journey!</title>
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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        
        .icon svg {
            width: 36px;
            height: 36px;
            color: #10b981;
        }
        
        .icon::after {
            content: '';
            position: absolute;
            inset: -2px;
            border-radius: 50%;
            background: linear-gradient(135deg, #10b981, #059669);
            z-index: -1;
            opacity: 0.1;
        }
        
        .title {
            font-size: 28px;
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
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 500;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
        }
        
        .info-box {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-left: 4px solid #10b981;
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
        
        .features {
            text-align: left;
            margin: 32px 0;
            background: #f8fafc;
            border-radius: 12px;
            padding: 24px;
        }
        
        .features h3 {
            color: #1e293b;
            font-size: 18px;
            margin-bottom: 16px;
            text-align: center;
        }
        
        .feature-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
        }
        
        .feature-icon {
            width: 20px;
            height: 20px;
            color: #10b981;
            margin-right: 12px;
            flex-shrink: 0;
            margin-top: 2px;
        }
        
        .feature-text {
            color: #64748b;
            font-size: 14px;
            line-height: 1.4;
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
            color: #10b981;
            text-decoration: none;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            padding: 8px;
            border-radius: 50%;
            background: #e2e8f0;
            color: #64748b;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .social-links a:hover {
            background: #10b981;
            color: white;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Learning<span class="vault">Vault</span></div>
        </div>
        <div class="content">
            <div class="icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <h1 class="title">Welcome to LearningVault! 🎉</h1>
            <p class="subtitle">Hi ${firstName}, your account has been successfully activated. You're all set to begin your learning journey!</p>
            
            <a href="#" class="button">Start Learning</a>
            
            <div class="features">
                <h3>What's waiting for you:</h3>
                <div class="feature-item">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <div class="feature-text">
                        <strong>Expert-designed courses</strong> from industry professionals
                    </div>
                </div>
                <div class="feature-item">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <div class="feature-text">
                        <strong>Join 10,000+ learners</strong> in our supportive community
                    </div>
                </div>
                <div class="feature-item">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    <div class="feature-text">
                        <strong>Track your progress</strong> with personalized learning analytics
                    </div>
                </div>
                <div class="feature-item">
                    <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                    </svg>
                    <div class="feature-text">
                        <strong>Earn certificates</strong> that boost your professional profile
                    </div>
                </div>
            </div>
            
            <div class="info-box">
                <p><strong>Next Steps:</strong> Complete your profile, explore our course recommendations, and join your first project-based learning experience. Your next breakthrough is just one lesson away!</p>
            </div>
        </div>
        <div class="footer">
            <p>Ready to transform your career? We're here to support you every step of the way.</p>
            <p><a href="#">Browse Courses</a> | <a href="#">Join Community</a> | <a href="#">Get Support</a></p>
            <div class="social-links">
                <a href="#" title="Facebook">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                </a>
                <a href="#" title="Twitter">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                </a>
                <a href="#" title="LinkedIn">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</body>
</html>
  `;
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
            <div class="icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
            </div>
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
  const { firstName, lastName, email, password, confirmPassword, termsAccepted, subscribeUpdates } = req.body;

  try {
    // Validate
    if (!firstName || !lastName || !email || !password || !confirmPassword || !termsAccepted)
      return res.status(400).json({ message: 'All required fields must be filled and terms accepted.' });
    if (password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match.' });

    const userExist = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (userExist.rows.length > 0)
      return res.status(400).json({ message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      `INSERT INTO users 
      (first_name,last_name,email,password,terms_accepted,subscribe_updates,otp,otp_expires) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [firstName, lastName, email, hashedPassword, termsAccepted, subscribeUpdates || false, otp, otpExpires]
    );

    // Send OTP email with professional template
    const htmlTemplate = generateOTPEmailTemplate(firstName, otp);
    await sendMail(email, 'Your Verification Code - LearningVault', htmlTemplate);

    res.status(201).json({ message: 'User registered. OTP sent to email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const result = await pool.query('SELECT otp, otp_expires, is_verified FROM users WHERE email=$1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: 'User not found.' });

    const user = result.rows[0];
    if (user.is_verified) return res.status(400).json({ message: 'User already verified.' });
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
    if (new Date() > user.otp_expires) return res.status(400).json({ message: 'OTP expired.' });

    await pool.query('UPDATE users SET is_verified=true, otp=NULL, otp_expires=NULL WHERE email=$1', [email]);
    res.json({ message: 'Email verified successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};