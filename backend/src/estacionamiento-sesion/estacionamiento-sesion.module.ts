import { Module } from '@nestjs/common';
import { EstacionamientoSesionService } from './estacionamiento-sesion.service';
import { EstacionamientoSesionController } from './estacionamiento-sesion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstacionamientoSesion } from './entities/estacionamiento-sesion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EstacionamientoSesion])],
  controllers: [EstacionamientoSesionController],
  providers: [EstacionamientoSesionService],
})
export class EstacionamientoSesionModule {}
