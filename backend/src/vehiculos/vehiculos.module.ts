import { Module } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { VehiculosController } from './vehiculos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { Zona } from 'src/zonas/entities/zona.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo, Zona])],
  controllers: [VehiculosController],
  providers: [VehiculosService],
})
export class VehiculosModule {}
