import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../utils/mail.js";

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
      "SELECT otp, otp_expires, is_verified FROM users WHERE email=$1",
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

    await pool.query(
      "UPDATE users SET is_verified=true, otp=NULL, otp_expires=NULL WHERE email=$1",
      [email]
    );
    res.json({ message: "Email verified successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
