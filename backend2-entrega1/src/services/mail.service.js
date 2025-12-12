import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mail.user,
        pass: config.mail.pass
      }
    });
  }

  async sendPasswordResetMail(email, token) {
    const resetLink = `${config.app.baseUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Recuperación de contraseña" <${config.mail.user}>`,
      to: email,
      subject: 'Recuperación de contraseña',
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Podés usar este token en el cliente / Thunder Client / Postman:</p>
        <pre>${token}</pre>
        <p>O entrar al siguiente enlace (si tuvieras frontend):</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>El enlace/token expira en 1 hora.</p>
      `
    };

    const result = await this.transporter.sendMail(mailOptions);
    return result;
  }
}

export const mailService = new MailService();