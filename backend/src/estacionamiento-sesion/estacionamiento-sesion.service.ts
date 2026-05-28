import { Inject, Injectable } from '@nestjs/common';
import { CreateEstacionamientoSesionDto } from './dto/create-estacionamiento-sesion.dto';
import { UpdateEstacionamientoSesionDto } from './dto/update-estacionamiento-sesion.dto';
import { Repository } from 'typeorm';
import { EstacionamientoSesion } from './entities/estacionamiento-sesion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoVehiculo, Vehiculo } from 'src/vehiculos/entities/vehiculo.entity';

@Injectable()
export class EstacionamientoSesionService {

  constructor(
    @InjectRepository(EstacionamientoSesion)
    private readonly estacionamientoSesionRepository: Repository<EstacionamientoSesion>,
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>
  ){}
  create(createEstacionamientoSesionDto: CreateEstacionamientoSesionDto) {
    return this.estacionamientoSesionRepository.save(createEstacionamientoSesionDto)
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

  async registarSesionEstacionamiento(createEstacionamientoSesionDto: CreateEstacionamientoSesionDto){
    const {pantenteVehiculo}=createEstacionamientoSesionDto
    const vehiculo=this.vehiculoRepository.findOneBy({patente:pantenteVehiculo})
    if(!vehiculo){
      await this.vehiculoRepository.create({patente:pantenteVehiculo,tipoVehiculo:TipoVehiculo.AUTO})

    }
    return await this.estacionamientoSesionRepository.save(createEstacionamientoSesionDto)

    
  }

}
