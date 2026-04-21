const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  }),
);

exports.sendEmail = (email, html) => {
  return transporter.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Welcome to our shop!",
    html: `
    {html}
    `,
  });
};
