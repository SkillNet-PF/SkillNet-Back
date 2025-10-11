import { UserRole } from 'src/common/enums/user-role.enum';

export interface ClientFilters {
  name?: string;
  email?: string;
  rol?: UserRole;
}
