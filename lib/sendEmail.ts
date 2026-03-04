import nodemailer from "nodemailer";

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // IMPORTANT
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"BIDOUILLE ET INFORMATIQUE" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}