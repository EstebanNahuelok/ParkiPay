import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagos } from './entities/pago.entity';
import { MercadoPagoConfig } from 'mercadopago';

@Module({
  imports:[TypeOrmModule.forFeature([Pagos])],
  controllers: [PagosController],
  providers: [
    PagosService,
    {
      provide: 'MP_CLIENT',
      useFactory: () =>
        new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! }),
    },
  ],
})
export class PagosModule {}
