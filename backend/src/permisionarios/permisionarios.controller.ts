import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermisionariosService } from './permisionarios.service';
import { CreatePermisionarioDto } from './dto/create-permisionario.dto';
import { UpdatePermisionarioDto } from './dto/update-permisionario.dto';

@Controller('permisionarios')
export class PermisionariosController {
  constructor(private readonly permisionariosService: PermisionariosService) {}

  @Post()
  create(@Body() createPermisionarioDto: CreatePermisionarioDto) {
    return this.permisionariosService.create(createPermisionarioDto);
  }

  @Get()
  findAll() {
    return this.permisionariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permisionariosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermisionarioDto: UpdatePermisionarioDto) {
    return this.permisionariosService.update(+id, updatePermisionarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permisionariosService.remove(+id);
  }
}
