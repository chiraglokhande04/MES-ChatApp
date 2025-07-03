const nodemailer = require("nodemailer");
const dotenv = require('dotenv')
//const {generateVerificationCode} = require('./generateTokens')

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});


//Email Templates
const welcomeEmailTemplate = (name) => {
    return `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Welcome to the Team, ${name}!</h1>
          </div>
          <div style="padding: 30px;">
            <p>Hi <strong>${name}</strong>,</p>
            <p>We're thrilled to have you on board! 🎉</p>
            <p>To get started, please download our internal communication app and log in using your company credentials.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourcompanyapp.com/download" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">Download the App</a>
            </div>
  
            <p>If you face any issues, feel free to reply to this email or contact us directly at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.</p>
            <p>Welcome once again and we look forward to great times ahead!</p>
            
            <p>Best regards, <br/>The Team at [Your Company Name]</p>
          </div>
          <div style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #777;">
            <p>Please do not share your login credentials with anyone.</p>
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  };
  

const otpMailTemplate = (otp) => {

    return `
     <h1>Email Verification</h1>
    <p>Your OTP for email verification is: <strong>${otp}</strong></p>
    <p>Please enter this OTP to verify your email address.</p>
    `
}


const sendWelcomeEmail = async (email, name) => {
    const emailContent = welcomeEmailTemplate(name);
    try {
        const info = await transporter.sendMail({
            from: `"Chirag Lokhande" <chiraglokhande10@gmail.com>`, // sender email
            to: email, // recipient email
            subject: `Hello ${name}, Get Set with Our Communication App `, // subject
            html: emailContent, // HTML email content
        });
        console.log("Welcome email sent successfully. Message ID: %s", info.messageId);
    } catch (err) {
        console.error("Error in sending welcome email:", err.message || err);
    }
};

const sendOTP = async (email, OTP) => {

    const emailContent = otpMailTemplate(OTP)
    try {
        const info = await transporter.sendMail({
            from: `"Chirag Lokhande" <chiraglokhande10@gmail.com>`, // sender email
            to: email, // recipient email
            subject: "OTP Verification !", // subject
            html: emailContent, // HTML email content
        });
        console.log("OTP sent successfully. Message ID: %s", info.messageId);
    } catch (err) {
        console.error("Error in sending OTP:", err.message || err);
    }

}


module.exports = {
    sendWelcomeEmail,
    sendOTP,
}; 