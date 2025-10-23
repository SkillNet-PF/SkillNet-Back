import { Module } from '@nestjs/common';
// import { MailerModule } from '@nestjs-modules/mailer'; // Temporalmente comentado
import { MailService } from './mail.service';

@Module({
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
