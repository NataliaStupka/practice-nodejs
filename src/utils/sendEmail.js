//Функціонал надсилання листів

import nodemailer from 'nodemailer'; //надсилання листів.
import { getEnv } from './getEnv.js'; //зчитування змінних оточення
import { ENV_VARS } from '../constants/env.js';
import createHttpError from 'http-errors';

// createTransport - до якого сервісу посилаємо повідомлення
const transporter = nodemailer.createTransport({
  host: getEnv(ENV_VARS.SMTP_HOST),
  port: Number(getEnv(ENV_VARS.SMTP_PORT)),
  auth: {
    user: getEnv(ENV_VARS.SMTP_USER),
    pass: getEnv(ENV_VARS.SMTP_PASS),
  },
});

// option - {to (отримувач), subject, html, from, ...}
export const sendEmail = async (options) => {
  try {
    //пробуємо надіслати email
    return await transporter.sendMail({
      to: options.to,
      subject: options.subject,
      from: options.from,
      html: options.html,
    });
  } catch (err) {
    console.error(err);
    return createHttpError(500, 'Failed to send an email');
  }
};
