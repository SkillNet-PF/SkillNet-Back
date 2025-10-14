import { ApiProperty } from '@nestjs/swagger';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import {
  IsOptional,
  IsIn,
  IsString,
  MinLength,
  Matches,
  MaxLength,
} from 'class-validator';
import { RegisterClientDto } from '../../auth/dto/register-client.dto';

export class UpdateClientDto extends PartialType(
  OmitType(RegisterClientDto, [
    'userId',
    'email',
    'rol',
    'password',
    'confirmPassword',
  ] as const),
) {
  @ApiProperty({
    enum: ['basic', 'standard', 'premium'],
    example: 'standard',
    description: 'Actualizar plan de suscripción',
    required: false,
  })
  @IsOptional()
  @IsIn(['basic', 'standard', 'premium'], {
    message: 'La suscripción debe ser basic, standard o premium',
  })
  subscription?: 'basic' | 'standard' | 'premium';

  @ApiProperty({
    example: 'currentPassword123',
    description: 'Contraseña actual (requerida para cambiar password)',
    required: false,
  })
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @ApiProperty({
    example: 'NewSecurePassword123!',
    description: 'Nueva contraseña',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'La nueva contraseña debe tener mínimo 6 caracteres',
  })
  @MaxLength(15, {
    message: 'La nueva contraseña debe tener máximo 15 caracteres',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/,
    {
      message:
        'La nueva contraseña debe tener mayúscula, minúscula, número y carácter especial',
    },
  )
  newPassword?: string;
}
