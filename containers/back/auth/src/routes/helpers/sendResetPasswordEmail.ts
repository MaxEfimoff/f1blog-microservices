const config = require('../../config/keys_dev');
import { createTransport } from 'nodemailer';

interface UserHash {
  toUser: {
    email: string;
    name: string;
  };
  hash: string;
}

const sendResetPasswordEmail = ({ toUser, hash }: UserHash, callback: any) => {
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      // user: config.google_user,
      // pass: config.google_password,
      user: "vuesocialnet@gmail.com",
      pass: "Aa02021984"
    },
  });

  const message = {
    from: config.google_user,
    to: toUser.email,
    subject: 'F1blog.ru - reset password',
    html: `
    <h3>Привет, ${toUser.name}</h3>
    <p>Вы получили это письмо, так как кто-то запросил смену пароля на F1blog.ru</p>
    <p>Если вы не запрашивали смену пароля, можете проигнорировать это письмо.</p>
    `,
    // <p>Для смены пароля пройдите по ссылке: <a target="_" href="${config.domain}/users/${hash}/reset-password">${config.domain}/reset-password </a></p>
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, info);
    }
  });
};

export { sendResetPasswordEmail };
