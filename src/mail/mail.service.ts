import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendRegistrationEmail(to: string, username: string) {
        const mailOptions = {
            from: `"SkillNet" <${process.env.EMAIL_USER}>`,
            to,
            subject: '¡Registro exitoso! 🎉',
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>¡Hola ${username}!</h2>
          <p>Tu registro en <b>SkillNet</b> fue exitoso ✅</p>
          <p>Ya podés iniciar sesión y comenzar a usar la plataforma.</p>
          <br/>
          <p>Saludos,<br>El equipo de SkillNet 🚀</p>
        </div>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Correo enviado a ${to}`);
        } catch (error) {
            console.error('❌ Error al enviar correo:', error);
        }
    }

    async sendAppointmentConfirmation(to: string, username: string, date: string, hour: string, provider: string) {
        const mailOptions = {
            from: `"SkillNet Turnos" <${process.env.EMAIL_USER}>`,
            to,
            subject: '🗓️ Turno reservado con éxito',
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>¡Hola ${username}!</h2>
          <p>Tu turno ha sido reservado correctamente.</p>
          <p><b>Detalles del turno:</b></p>
          <ul>
            <li><b>Proveedor:</b> ${provider}</li>
            <li><b>Fecha:</b> ${new Date(date).toLocaleDateString('es-AR')}</li>
            <li><b>Hora:</b> ${hour}</li>
          </ul>
          <p>Podés consultar o cancelar el turno desde tu cuenta en <b>SkillNet</b>.</p>
          <br/>
          <p>Saludos,<br>El equipo de SkillNet 🚀</p>
        </div>
      `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`✅ Correo de turno enviado a ${to}`);
        } catch (error) {
            console.error('❌ Error al enviar correo de turno:', error);
        }
    }
}
