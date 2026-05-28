import { Injectable } from '@nestjs/common';
import { CreateEstacionamientoSesionDto } from './dto/create-estacionamiento-sesion.dto';
import { UpdateEstacionamientoSesionDto } from './dto/update-estacionamiento-sesion.dto';
import { Repository } from 'typeorm';
import { EstacionamientoSesion } from './entities/estacionamiento-sesion.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EstacionamientoSesionService {

  constructor(
    @InjectRepository(EstacionamientoSesion)
    private readonly estacionamientoSesionRepository: Repository<EstacionamientoSesion>,
  ){}

  async create(dto: CreateEstacionamientoSesionDto) {
    const sesion = this.estacionamientoSesionRepository.create({
      horasDeseadas: dto.horas,
    });
    return this.estacionamientoSesionRepository.save(sesion);
  }

  findAll() {
    return `This action returns all estacionamientoSesion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} estacionamientoSesion`;
  }

  update(id: number, updateEstacionamientoSesionDto: UpdateEstacionamientoSesionDto) {
    return `This action updates a #${id} estacionamientoSesion`;
  }

  remove(id: number) {
    return `This action removes a #${id} estacionamientoSesion`;
  }

}
