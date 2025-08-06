import nodemailer from 'nodemailer';

// Konfigurasi ini mengambil data langsung dari file .env lu
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: true, // true untuk port 465, false untuk port lain
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const mailOptions = {
  from: process.env.EMAIL_FROM,
};