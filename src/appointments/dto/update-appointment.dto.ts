import { IsNotEmpty, IsString } from "class-validator";


export class UpdateAppointmentDto {

    @IsNotEmpty()
    @IsString()
    Status: string
}
