import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateAppointmentDto {

   @IsNotEmpty()
   @IsString() 
    category: string; //nombre de la categoria

    @IsNotEmpty()
    @IsDate()
    appointmentDate:Date;

    @IsNotEmpty()
    hour: string;

    
    @IsNotEmpty()
    @IsString()
    notes: string;

    @IsNotEmpty()
    @IsString()
    provider: string; //nombre del proveedor
}
