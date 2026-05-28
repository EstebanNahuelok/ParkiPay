import { Module } from '@nestjs/common';
import { PermisionariosService } from './permisionarios.service';
import { PermisionariosController } from './permisionarios.controller';
import { PermisionarioAuthController } from './permisionario-auth.controller';
import { PermisionarioAuthService } from './permisionario-auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permisionario } from './entities/permisionario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permisionario])],
  controllers: [PermisionariosController, PermisionarioAuthController],
  providers: [PermisionariosService, PermisionarioAuthService],
})
export class PermisionariosModule {}
