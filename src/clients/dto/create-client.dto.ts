//falta agregar validaciones, decoradores y swagger

export class CreateClientDto {
  imgProfile: string;
  name: string;
  birthDate: string;
  email: string;
  idExternalPassword: string;
  address: string;
  phone: string;
  role: string;
  paymentMethod?: string;
  isActive: boolean;
  // subscriptionId?: string;
  // providerId?: string;
}
