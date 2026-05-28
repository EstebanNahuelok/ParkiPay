import { randomUUID } from "crypto";
import { EstacionamientoSesion } from "src/estacionamiento-sesion/entities/estacionamiento-sesion.entity";
import { Permisionario } from "src/permisionarios/entities/permisionario.entity";
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("zonas")
export class Zona {

    @PrimaryGeneratedColumn("uuid")
    id:string

    @Column("text")
    nombreZona:string

    @Column("boolean",{default:false})
    estacionamientoNoctruno:boolean=false

    @Column({
    unique:true
    })
    qrToken:string;

    @OneToMany(()=>Permisionario,permisionario=>permisionario.zonaAsignada)
    permisionarios:Permisionario[]

    @Column("numeric")
    tarifa:number

    @OneToMany(()=>EstacionamientoSesion, estacionamientoSesion=>estacionamientoSesion.zona)
    estacionamientosSesion:EstacionamientoSesion[]

    @BeforeInsert()
    generateQRToken(){

    this.qrToken =
    `ZONE-${randomUUID()}`;

    }

}
