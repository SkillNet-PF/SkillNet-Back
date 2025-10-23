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
    // 🔹 Nuevo método para enviar correo de confirmación de suscripción
    async sendSubscriptionConfirmation(
        to: string,           // correo del usuario
        username: string,     // nombre del usuario
        planName: string,     // nombre del plan (BASIC, STANDARD, PREMIUM)
        monthlyServices: number, // cantidad de servicios
        price: number         // precio
    ) {
        const mailOptions = {
            from: `"SkillNet Suscripción" <${process.env.EMAIL_USER}>`, // 🔹 asunto del remitente actualizado
            to,
            subject: `✅ Suscripción al plan ${planName} activada con éxito`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>¡Hola ${username}!</h2>
            <p>Tu suscripción al plan <b>${planName}</b> ha sido activada correctamente.</p>
            <p><b>Detalles del plan:</b></p>
            <ul>
            <li><b>Servicios mensuales:</b> ${monthlyServices}</li>
            <li><b>Precio:</b> $${price}</li>
            </ul>
            <p>Podés gestionar tu suscripción desde tu cuenta en <b>SkillNet</b>.</p>
            <br/>
            <p>Saludos,<br>El equipo de SkillNet 🚀</p>
        </div>
        `,
        };

        try {
            await this.transporter.sendMail(mailOptions); // 🔹 envío de correo
            console.log(`✅ Correo de suscripción enviado a ${to}`); // 🔹 log
        } catch (error) {
            console.error('❌ Error al enviar correo de suscripción:', error); // 🔹 manejo de errores
        }
    }

    async sendAppointmentCancellation(
        to: string,           // correo del usuario
        username: string,     // nombre del usuario
        date: string,         // fecha del turno
        hour: string,         // hora del turno
        provider: string      // nombre del proveedor
    ) {
        const mailOptions = {
            from: `"SkillNet Turnos" <${process.env.EMAIL_USER}>`, // 🔹 remitente
            to,
            subject: '❌ Turno cancelado', // 🔹 asunto
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>¡Hola ${username}!</h2>
        <p>Tu turno ha sido cancelado correctamente.</p>
        <p><b>Detalles del turno cancelado:</b></p>
        <ul>
            <li><b>Proveedor:</b> ${provider}</li>
            <li><b>Fecha:</b> ${new Date(date).toLocaleDateString('es-AR')}</li>
            <li><b>Hora:</b> ${hour}</li>
        </ul>
        <p>Si tenés dudas, podés consultar tu cuenta en <b>SkillNet</b>.</p>
        <br/>
        <p>Saludos,<br>El equipo de SkillNet 🚀</p>
        </div>
    `,
        };

        try {
            await this.transporter.sendMail(mailOptions); // 🔹 envío de correo
            console.log(`✅ Correo de cancelación enviado a ${to}`); // 🔹 log
        } catch (error) {
            console.error('❌ Error al enviar correo de cancelación:', error); // 🔹 manejo de errores
        }
    }

}
