import { Module } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { ZonasController } from './zonas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zona } from './entities/zona.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Zona])],
  controllers: [ZonasController],
  providers: [ZonasService],
})
export class ZonasModule {}
