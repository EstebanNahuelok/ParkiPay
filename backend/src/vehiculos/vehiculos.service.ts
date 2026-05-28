import { Injectable } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Repository } from 'typeorm';
import { Zona } from 'src/zonas/entities/zona.entity';
import { Vehiculo } from './entities/vehiculo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Zona)
    private readonly zonasRepository:Repository<Zona>
  ){

  }
  async create(createVehiculoDto: CreateVehiculoDto) {
    const newVehiculo=await this.vehiculoRepository.create(createVehiculoDto)
    await this.vehiculoRepository.save(newVehiculo)
    return newVehiculo
  }

  findAll() {
    return this.vehiculoRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} vehiculo`;
  }

  update(id: number, updateVehiculoDto: UpdateVehiculoDto) {
    return `This action updates a #${id} vehiculo`;
  }

  remove(id: number) {
    return `This action removes a #${id} vehiculo`;
  }

  async escanearQRZona(qrToken:string){
    const zoneExists=await  this.zonasRepository.findOneBy({qrToken})
    return zoneExists
  }
}
