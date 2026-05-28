import { IsNumber, IsString } from "class-validator";

export class CreateZonaDto {
    @IsString()
    nombreZona:string

    @IsNumber()
    tarifa:number

}
