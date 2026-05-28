import {
 Column,
 CreateDateColumn,
 Entity,
 ManyToOne,
 PrimaryGeneratedColumn,
 UpdateDateColumn
} from "typeorm";

import { Permisionario } from "src/permisionarios/entities/permisionario.entity";
import { EstacionamientoSesion } from "src/estacionamiento-sesion/entities/estacionamiento-sesion.entity";

export enum PaymentMethod {
 CASH="CASH",
 TRANSFER="TRANSFER",
 DEBIT_CARD="DEBIT_CARD",
 CREDIT_CARD="CREDIT_CARD",
 MERCADO_PAGO="MERCADO_PAGO"
}

export enum PaymentStatus {
 PENDING="PENDING",
 APPROVED="APPROVED",
 REJECTED="REJECTED",
 REFUNDED="REFUNDED"
}

@Entity("payments")
export class Pagos {

 @PrimaryGeneratedColumn("uuid")
 id:string;

 @Column({
   type:"decimal",
   precision:10,
   scale:2
 })
 amount:number;

 @Column({
   type:"enum",
   enum:PaymentMethod
 })
 paymentMethod:PaymentMethod;

 @Column({
   type:"enum",
   enum:PaymentStatus,
   default:PaymentStatus.PENDING
 })
 status:PaymentStatus;

 @Column({
   default:false
 })
 digitalDiscountApplied:boolean;

 @Column({
   type:"decimal",
   precision:10,
   scale:2,
   default:0
 })
 discountAmount:number;

 @Column({
   nullable:true
 })
 externalPaymentId:string;

 @ManyToOne(
   ()=> EstacionamientoSesion,
   session => session.pago
 )
 estacionamientoSesion:EstacionamientoSesion;

 @ManyToOne(
   ()=> Permisionario,
   permisionario => permisionario.id
 )
 permisionario:Permisionario;

 @CreateDateColumn()
 createdAt:Date;

 @UpdateDateColumn()
 updatedAt:Date;

}