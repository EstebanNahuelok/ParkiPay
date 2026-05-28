import { Pagos } from "src/pagos/entities/pago.entity";
import { Permisionario } from "src/permisionarios/entities/permisionario.entity";
import { Vehiculo } from "src/vehiculos/entities/vehiculo.entity";
import { Zona } from "src/zonas/entities/zona.entity";

import {
 Entity,
 PrimaryGeneratedColumn,
 ManyToOne,
 Column,
 OneToMany,
 CreateDateColumn
} from "typeorm";

export enum SessionStatus {
 ACTIVE = "ACTIVE",
 FINISHED = "FINISHED",
 CANCELLED = "CANCELLED"
}

@Entity("parking_sessions")
export class EstacionamientoSesion {

 @PrimaryGeneratedColumn("uuid")
 id:string;

 @ManyToOne(
   ()=> Vehiculo
 )
 vehiculo:Vehiculo;


 @Column({
   type:"numeric"
 })
 horasDeseadas:number;

 @Column({
   type:"enum",
   enum:SessionStatus,
   default:SessionStatus.ACTIVE
 })
 status:SessionStatus;

 @CreateDateColumn()
 startTime:Date;

 @Column({
   nullable:true
 })
 endTime:Date;

@ManyToOne(
  ()=>Zona,zona=>zona.estacionamientosSesion
)
 zona:Zona


 @ManyToOne(
  ()=>Pagos, pago=>pago.estacionamientoSesion
 )
  pago:Pagos
}