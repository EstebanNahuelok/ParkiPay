import { Injectable } from '@nestjs/common';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Zona } from './entities/zona.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ZonasService {
  constructor(
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>
  ){}
  async create(createZonaDto: CreateZonaDto) {
    const zona= this.zonaRepository.create(createZonaDto)
    return await this.zonaRepository.save(zona)
  }

  findAll() {
    return this.zonaRepository.find()
  }

  async findOne(id: string) {
    return this.zonaRepository.findOneBy({ id });
  }

  async update(id: string, updateZonaDto: UpdateZonaDto) {
    await this.zonaRepository.update(id, updateZonaDto);
    return this.zonaRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const zona = await this.zonaRepository.findOneBy({ id });
    if (zona) {
      await this.zonaRepository.remove(zona);
    }
  }
  
}
