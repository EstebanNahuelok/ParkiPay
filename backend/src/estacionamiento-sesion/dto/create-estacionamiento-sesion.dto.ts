import { Vehiculo } from "src/vehiculos/entities/vehiculo.entity";
import { Zona } from "src/zonas/entities/zona.entity";

export class CreateEstacionamientoSesionDto {

    pantenteVehiculo:string
    zona:Zona
    horasDeseadas:number
}
