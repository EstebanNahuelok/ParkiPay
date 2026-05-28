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
    return this.authService.getCuadra();
  }

  @Get('historial')
  getHistorial() {
    return this.authService.getHistorial();
  }

  @Post('ticket/emitir')
  @HttpCode(HttpStatus.CREATED)
  emitirTicket(@Body() body: { patente: string; tipo_vehiculo: string; horas: number; metodo_pago: string }) {
    return this.authService.emitirTicket(body, 'demo');
  }
}
