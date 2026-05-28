import { Zona } from "src/zonas/entities/zona.entity"
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm"

@Entity()
export class Permisionario {
    @PrimaryColumn('uuid')
    id:string
    @Column({
        unique: true
    })   
    legajo:number
    @Column()
    nombre:string
    @Column()
    apellido:string

    @Column()
    activo:boolean

    @ManyToOne(()=>Zona, zona=>zona.permisionarios)
    zonaAsignada:Zona

}
