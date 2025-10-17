import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriptionDto {
        @IsEmpty()        
        SuscriptionID: string;
    
        @IsNotEmpty()
        @IsString()
        Name: string;
    
        @IsNotEmpty()
        @IsString()
        Descption:string;
    
        @IsNotEmpty()
        @IsString()
        monthlyServices:string;
    
        @IsNotEmpty()
        @IsString()
        price:string;
    
        @IsEmpty()
        isActive: boolean
}


