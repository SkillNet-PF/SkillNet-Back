import { UserRole } from 'src/common/enums/user-role.enum';

export interface AuthenticatedClient {
  userId: string;
  email: string;
  rol: UserRole;
}
