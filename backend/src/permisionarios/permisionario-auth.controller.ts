import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PermisionarioAuthService } from './permisionario-auth.service';

@Controller('permisionario')
export class PermisionarioAuthController {

  constructor(private readonly authService: PermisionarioAuthService) {}

  @Post('check-legajo')
  @HttpCode(HttpStatus.OK)
  checkLegajo(@Body() body: { numero_legajo: string }) {
    return this.authService.checkLegajo(body.numero_legajo);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: { numero_legajo: string; pin: string }) {
    return this.authService.login(body.numero_legajo, body.pin);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() body: { numero_legajo: string; pin: string; dni_ultimos3: string }) {
    return this.authService.register(body.numero_legajo, body.pin, body.dni_ultimos3);
  }

  @Get('cuadra')
  getCuadra() {
    return {
      zona: {
        nombre: 'Zona Centro',
        cuadras: 'Caseros 100-500 · Mitre 200-400',
      },
      recaudacion_hoy: 0,
      tickets_hoy: 0,
      total_activos: 0,
      vehiculos_activos: [],
    };
  }

  @Get('historial')
  getHistorial() {
    return {
      liquidacion: {
        total_recaudado: 0,
        monto_permisionario: 0,
        efectivo_recibido: 0,
        digital_recibido: 0,
        debe_entregar: 0,
      },
      resumen: {
        total_tickets: 0,
      },
      tickets: [],
    };
  }

  @Post('ticket/emitir')
  @HttpCode(HttpStatus.CREATED)
  emitirTicket(@Body() body: { patente: string; tipo_vehiculo: string; horas: number; metodo_pago: string }) {
    const tarifas: Record<string, number> = { auto: 700, moto: 300 };
    const tarifa = tarifas[body.tipo_vehiculo] ?? 700;
    const montoOriginal = tarifa * body.horas;
    const esDigital = body.metodo_pago === 'digital';
    const descuento = esDigital ? Math.round(montoOriginal * 0.20) : 0;
    const montoTotal = montoOriginal - descuento;
    const ahora = new Date();
    const horaFin = new Date(ahora.getTime() + body.horas * 60 * 60 * 1000);

    return {
      ticket: {
        id: `TKT-${Date.now()}`,
        codigo: `EST-${Date.now().toString().slice(-8)}`,
        patente: body.patente.toUpperCase(),
        tipo_vehiculo: body.tipo_vehiculo,
        horas: body.horas,
        tarifa_hora: tarifa,
        monto_original: montoOriginal,
        descuento,
        monto_total: montoTotal,
        metodo_pago: body.metodo_pago,
        hora_inicio: ahora.toISOString(),
        hora_fin: horaFin.toISOString(),
        estado: 'activo',
      },
    };
  }
}
