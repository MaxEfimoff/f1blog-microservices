const config = require('../../config/keys_dev');
import { createTransport } from 'nodemailer';
// import { google_user, google_password, domain } from '../../config/keys_dev'

interface UserHash {
  toUser: {
    email: string;
    name: string;
  };
  hash: string;
}

const sendConfirmationEmail = ({ toUser, hash }: UserHash, callback: any) => {
  console.log(config.google_user, config.google_password);

  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: config.google_user,
      pass: config.google_password,
    },
  });

  const message = {
    from: config.google_user,
    to: toUser.email,
    subject: 'F1blog - activate account',
    html: `
    <h3>Привет! ${toUser.name}</h3>
    <p>Спасибо за регистрацию на портале F1blog.ru!</p>
    <p>Для активации аккаунта, пройдите по ссылке: <a target="_" href="${config.domain}/users/${hash}/activate">${config.domain}/activate </a></p>
    `,
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, info);
    }
  });
};

export { sendConfirmationEmail };
