

require("dotenv").config();
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});


const sendEmail = async (to, subject, html) => {
  const message = {
    from: 'ваш_электронный_адрес@gmail.com',
    to,
    subject,
    html,
  };

  try {
    await transport.sendMail(message);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail
 
