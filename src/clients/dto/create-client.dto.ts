//falta agregar validaciones, decoradores y swagger

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    example: 'http://image.url',
    description: 'URL de la imagen de perfil',
  })
  @IsString()
  @IsOptional()
  imgProfile: string;

  @ApiProperty({
    example: 'Juan Perez',
    description: 'Nombre completo del cliente',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Fecha de nacimiento del cliente',
  })
  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    example: 'cliente@example.com',
    description: 'Correo electrónico del cliente',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Contraseña del cliente para el sistema externo',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Dirección del cliente',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Número de teléfono del cliente',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  //Yo como usuario quiero poder tener la opción de registrarme como cliente o proveedor, para así acceder a los servicios que ofrece la plataforma según mi rol. El rol admin solo podrá ser asignado por el sistema o por otros administradores, no por el usuario al registrarse.
  @ApiProperty({
    enum: ['client', 'provider'],
    example: 'client',
    description: 'Selecciona si serás cliente o proveedor de servicios',
  })
  @IsIn(['client', 'provider'], {
    message: 'Seleccione si desea ser cliente o proveedor',
  })
  @IsNotEmpty()
  @IsString()
  role: string;

  //Como usuario quiero poder elegir entre diferentes planes de suscripción (básico, estándar, premium) al registrarme, para acceder a distintas funcionalidades y beneficios según el plan seleccionado.
  @ApiProperty({
    enum: ['basic', 'standard', 'premium'],
    example: 'basic',
    description: 'Selecciona el plan de suscripción',
  })
  @IsIn(['basic', 'standard', 'premium'], {
    message: 'El plan de suscripción debe ser basic, standard o premium',
  })
  @IsString()
  @IsNotEmpty()
  subscription: string;

  // @ApiProperty({
  //   example: ['servicio1', 'servicio2'],
  //   description: 'Lista de servicios asociados al cliente',
  // })
  // @IsString({ each: true })
  // @IsOptional()
  // services?: string[];

  // @ApiHideProperty()
  // isActive: boolean;
}
