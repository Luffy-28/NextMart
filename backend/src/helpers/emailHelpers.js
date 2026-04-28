import nodemailer from "nodemailer";
import { config } from "../config/config.js";

export const sendVerificationEmail = async (email, firstName, token) => {
  const transporter = nodemailer.createTransport(config.smtp);

  const info = await transporter.sendMail({
    from: '"Ashon" <cupquest2026@gmail.com>',
    to: email,
    subject: "Hello " + firstName,
    html: `<b>Thank you for registration! this is your code: ${token} 
    <br/> Link: <a href='${config.appUrl}/verify?email=${email}&token=${token}' > OPEN LINK </a> `,
  });

  console.log("Message sent:", info.messageId);
};
