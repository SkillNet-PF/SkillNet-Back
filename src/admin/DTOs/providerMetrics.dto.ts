import { IsOptional, IsString } from "class-validator";

export class provideMetricsDto {

    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    category: string;
    dias: string[];
    horas: string[];
    completedAppointments: number;
    canceledAppointments: number;
    pendingAppointments: number;
}