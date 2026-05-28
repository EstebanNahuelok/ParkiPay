import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstacionamientoSesionService } from './estacionamiento-sesion.service';
import { CreateEstacionamientoSesionDto } from './dto/create-estacionamiento-sesion.dto';
import { UpdateEstacionamientoSesionDto } from './dto/update-estacionamiento-sesion.dto';

@Controller('estacionamiento-sesion')
export class EstacionamientoSesionController {
  constructor(private readonly estacionamientoSesionService: EstacionamientoSesionService) {}

  @Post()
  create(@Body() createEstacionamientoSesionDto: CreateEstacionamientoSesionDto) {
    return this.estacionamientoSesionService.create(createEstacionamientoSesionDto);
  }

  @Get()
  findAll() {
    return this.estacionamientoSesionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.estacionamientoSesionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEstacionamientoSesionDto: UpdateEstacionamientoSesionDto) {
    return this.estacionamientoSesionService.update(+id, updateEstacionamientoSesionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.estacionamientoSesionService.remove(+id);
  }
}
