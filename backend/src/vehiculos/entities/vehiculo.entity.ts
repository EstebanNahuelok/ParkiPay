import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum TipoVehiculo {
  AUTO = "AUTO",
  MOTO = "MOTO",
}

@Entity("vehiculos")
export class Vehiculo {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: TipoVehiculo,
  })
  tipoVehiculo: TipoVehiculo;

  @Column({
    unique: true,
    
  })
  patente: string;


}