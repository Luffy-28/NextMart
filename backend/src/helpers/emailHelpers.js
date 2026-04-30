import nodemailer from "nodemailer";
import { config } from "../config/config.js";

const transporter = nodemailer.createTransport(config.smtp);
export const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"${config.appName || "NextMart"}" <${config.smtp.auth.user}>`,
    to: email,
    subject: "Verify Your Email - OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; padding: 20px; text-align: center; 
                     margin: 20px 0; border-radius: 8px; border: 2px dashed #667eea; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; 
                      letter-spacing: 8px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .warning { color: #e74c3c; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for signing up! Please use the following OTP code to verify your email address:</p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #666;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 0; color: #666; font-size: 14px;">Valid for ${config.otp.expiry / 60} minutes</p>
            </div>
            
            <p>If you didn't request this code, please ignore this email.</p>
            
            <p class="warning">⚠️ Never share this code with anyone. We will never ask for your OTP.</p>
            
            <p>Best regards,<br>The ${config.appName || "Auth System"} Team</p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send verification email");
  }
};


export const sendWelcomeEmail = async(email, name) => {
  const mailOptions ={
    from: `"${config.appName || "NextMart"}" <${config.smtp.auth.user}>`,
    to: email,
    subject: `Welcome to ${config.appName}`,
     html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); 
                    color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #11998e; 
                   color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome Aboard!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Congratulations! Your email has been successfully verified.</p>
            <p>You can now access all features of your account.</p>
            
            <a href="${config.clientUrl}/dashboard" class="button">Go to Dashboard</a>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            
            <p>Best regards,<br>The ${config.appName} Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send welcome email");
  }
}
