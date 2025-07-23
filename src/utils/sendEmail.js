import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const emailOptions = {
    from: process.env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(emailOptions);
    console.log(`Email sent successfully to ${options.to}`);
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send the email, please try again later.');
  }
};
