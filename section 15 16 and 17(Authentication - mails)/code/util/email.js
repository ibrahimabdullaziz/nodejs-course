const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  }),
);

exports.sendWelcomeEmail = (email) => {
  return transporter.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Welcome to our shop!",
    html: `
      <h1>Hi, welcome to our shop!</h1>
      <p>Thank you for signing up. We're glad to have you!</p>
      <p>Start exploring our products and enjoy your shopping experience.</p>
      <br/>
      <p>Best regards,<br/>The Shop Team</p>
    `,
  });
};
