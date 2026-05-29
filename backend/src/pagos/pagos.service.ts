import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagos, PaymentMethod, PaymentStatus } from './entities/pago.entity';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { Preference, Payment } from 'mercadopago';
import MercadoPagoConfig from 'mercadopago';
import { ConfigService } from '@nestjs/config';  // ← agregar

@Injectable()
export class PagosService {
  private preference: Preference;
  private payment: Payment;

  constructor(
    @InjectRepository(Pagos)
    private readonly pagosRepo: Repository<Pagos>,

    @Inject('MP_CLIENT')
    private readonly mpClient: MercadoPagoConfig,

    private readonly configService: ConfigService,  // ← agregar
  ) {
    this.preference = new Preference(mpClient);
    this.payment = new Payment(mpClient);
  }

  async createPreference(dto: CreatePreferenceDto) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL')
    console.log('FRONTEND_URL:', frontendUrl)

    const pago = this.pagosRepo.create({
      amount: dto.amount,
      paymentMethod: PaymentMethod.MERCADO_PAGO,
      status: PaymentStatus.PENDING,
      estacionamientoSesion: { id: dto.sesionId },
    });
    const pagoDB = await this.pagosRepo.save(pago);

    const response = await this.preference.create({
      body: {
        external_reference: pagoDB.id,
        items: [
          {
            id: dto.sesionId,
            title: `Estacionamiento - ${dto.patente}`,
            quantity: 1,
            unit_price: Number(dto.amount),
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: `${frontendUrl}/ticket`,        // ← usar variable
          failure: `${frontendUrl}/pagar?error=true`,
          pending: `${frontendUrl}/ticket?pending=true`,
        },
        // auto_return: 'approved',
      },
    });

    return {
      pagoId: pagoDB.id,
      init_point: response.init_point,
    };
  }

  async handleWebhook(body: any) {
    if (body.type !== 'payment') return;

    const mpPayment = await this.payment.get({ id: body.data.id });
    const pagoId = mpPayment.external_reference;

    if (!pagoId) return;

    const pago = await this.pagosRepo.findOne({ where: { id: pagoId } });
    if (!pago) return;

    const statusMap: Record<string, PaymentStatus> = {
      approved: PaymentStatus.APPROVED,
      rejected: PaymentStatus.REJECTED,
      pending:  PaymentStatus.PENDING,
    };

    pago.status = statusMap[mpPayment.status as string] ?? PaymentStatus.PENDING;
    pago.externalPaymentId = String(body.data.id);
    await this.pagosRepo.save(pago);
  }

  async findOne(id: string) {
    const pago = await this.pagosRepo.findOne({ where: { id } });
    if (!pago) throw new NotFoundException(`Pago ${id} no encontrado`);
    return pago;
  }
}