import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('parked_cars')
export class ParkedCar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  lat: number;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  lng: number;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  note: string;

  @Column({ type: 'text', nullable: true })
  photo_url: string;

  @CreateDateColumn()
  timestamp: Date;
}
