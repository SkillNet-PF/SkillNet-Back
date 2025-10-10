export class CreateServiceproviderDto {
    name: string;
    email: string;
    externalAuthId: string;
    bio?: string;
    dias?: string[];
    horarios?: string[];
    categoryId?: string;
    address?: string;
    phone?: string;
}
