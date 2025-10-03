import { UserRole } from '../../common/enums/user-role.enum';
import { IsEnum } from 'class-validator';

export class User {
  userId!: string;
  imgProfile?: string;
  name!: string;
  birthDate?: string;
  email!: string;
  externalAuthId!: string;
  address?: string;
  phone?: string;
  rol!: UserRole;
  paymentMethod?: string | null;
  suscriptionId?: string;
  providerId?: string;
  isActive!: boolean;

}
