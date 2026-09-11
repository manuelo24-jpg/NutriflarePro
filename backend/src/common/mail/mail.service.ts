import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private etherealPreviewUrl: string | null = null;
  private initialized = false;

  constructor(private configService: ConfigService) {}

  private async ensureTransporter() {
    if (this.initialized) return;
    this.initialized = true;

    const host = this.configService.get<string>('SMTP_HOST');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      const port = this.configService.get<number>('SMTP_PORT', 2525);
      this.transporter = nodemailer.createTransport({ host, port, auth: { user, pass } });
      this.logger.log(`[MailService] Using configured SMTP: ${host}:${port}`);
    } else {
      // Auto-create Ethereal test account for development
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: { user: testAccount.user, pass: testAccount.pass },
        });
        this.logger.log(`\n${'='.repeat(60)}`);
        this.logger.log(`[MailService] Ethereal dev email ready!`);
        this.logger.log(`  User: ${testAccount.user}`);
        this.logger.log(`  Pass: ${testAccount.pass}`);
        this.logger.log(`  View emails at: https://ethereal.email/login`);
        this.logger.log(`${'='.repeat(60)}\n`);
      } catch (err) {
        this.logger.warn('[MailService] Could not create Ethereal account — emails will only be logged.');
      }
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    await this.ensureTransporter();

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    this.logger.log(`\n${'='.repeat(60)}`);
    this.logger.log(`[PASSWORD RESET LINK] To: ${email}`);
    this.logger.log(`URL: ${resetUrl}`);
    this.logger.log(`${'='.repeat(60)}\n`);

    if (!this.transporter) return { resetUrl };

    try {
      const from = this.configService.get<string>('SMTP_FROM', 'NutriFlare <no-reply@nutriflare.com>');
      const info = await this.transporter.sendMail({
        from,
        to: email,
        subject: 'Recuperación de Contraseña — NutriFlare',
        html: `
          <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0f172a;color:#f8fafc;border-radius:16px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:28px;">
              <div style="width:36px;height:36px;background:#22c55e;border-radius:10px;display:flex;align-items:center;justify-content:center;">
                <span style="color:#000;font-weight:900;font-size:18px;">N</span>
              </div>
              <span style="font-size:20px;font-weight:700;color:#fff;">NutriFlare</span>
            </div>
            <h2 style="color:#fff;margin:0 0 8px;">Restablece tu contraseña</h2>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px;">
              Hemos recibido una solicitud para cambiar la contraseña de tu cuenta NutriFlare.<br>
              Este enlace caduca en <strong style="color:#e2e8f0;">1 hora</strong>.
            </p>
            <div style="margin:32px 0;text-align:center;">
              <a href="${resetUrl}"
                style="background:#22c55e;color:#000;padding:14px 32px;font-weight:700;border-radius:10px;text-decoration:none;font-size:15px;display:inline-block;">
                Restablecer contraseña
              </a>
            </div>
            <div style="border-top:1px solid #1e293b;margin-top:32px;padding-top:20px;">
              <p style="color:#64748b;font-size:12px;margin:0;">
                Si no solicitaste este cambio, ignora este correo. Tu contraseña actual seguirá siendo válida.
              </p>
            </div>
          </div>
        `,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`\n📧 Preview email at: ${previewUrl}\n`);
      }
      this.logger.log(`[MailService] Email enviado a ${email} — Message ID: ${info.messageId}`);
    } catch (err) {
      this.logger.error(`[MailService] Error sending email to ${email}:`, err);
    }

    return { resetUrl };
  }
}
