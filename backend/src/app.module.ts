import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { PermisionariosModule } from './permisionarios/permisionarios.module';
import { ZonasModule } from './zonas/zonas.module';
import { PagosModule } from './pagos/pagos.module';
import { EstacionamientoSesionModule } from './estacionamiento-sesion/estacionamiento-sesion.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),VehiculosModule, PermisionariosModule, ZonasModule, PagosModule, EstacionamientoSesionModule,
  TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  autoLoadEntities: true,
  synchronize: true,

  ssl: {
    rejectUnauthorized: false,
  },
})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
