import { PartialType } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './create-subscription.dto';
import { PrimaryColumn, Column } from 'typeorm';
import { IsEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
      @IsEmpty()
      
        SuscriptionID: string ;
    
        @IsOptional()
        @IsString()
        Name: string;
    
        @IsOptional()
        @IsString()
        Descption:string;
    
        @IsOptional()
        @IsString()
        monthlyServices:string;
    
        @IsOptional()
        @IsString()
        price:string
    
        @IsEmpty()
        isActive: boolean
}
