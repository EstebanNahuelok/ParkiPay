import { Module } from '@nestjs/common';
import { PermisionariosService } from './permisionarios.service';
import { PermisionariosController } from './permisionarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permisionario } from './entities/permisionario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Permisionario])],
  controllers: [PermisionariosController],
  providers: [PermisionariosService],
})
export class PermisionariosModule {}
