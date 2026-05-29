import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePreferenceDto } from './dto/create-preference.dto';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  // El frontend llama esto para obtener el link de MP
  @Post('preference')
  createPreference(@Body() dto: CreatePreferenceDto) {
    return this.pagosService.createPreference(dto);
  }

  // MP llama esto automáticamente cuando el usuario paga
  @Post('webhook')
  @HttpCode(200)
  handleWebhook(@Body() body: any) {
    return this.pagosService.handleWebhook(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pagosService.findOne(id);
  }
}