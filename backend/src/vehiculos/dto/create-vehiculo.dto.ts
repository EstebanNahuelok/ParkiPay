import {
 IsEnum,
 IsString,
 Matches
} from "class-validator";

export enum TipoVehiculo {
 AUTO = "AUTO",
 MOTO = "MOTO"
}

export class CreateVehiculoDto {

 @IsString()
 @Matches(
   /^([A-Z]{2}[0-9]{3}[A-Z]{2}|[A-Z]{3}[0-9]{3})$/,
   {
     message:"Formato de patente inválido"
   }
 )
 patente:string;

 @IsEnum(TipoVehiculo)
 tipoVehiculo: TipoVehiculo;

}