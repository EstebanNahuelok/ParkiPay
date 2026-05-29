import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParkedCar } from './entities/parked-car.entity';

@Injectable()
export class ParkedCarsService {
  constructor(
    @InjectRepository(ParkedCar)
    private readonly parkedCarRepository: Repository<ParkedCar>,
  ) {}

  async findAll(): Promise<ParkedCar[]> {
    return this.parkedCarRepository.find({
      order: { timestamp: 'DESC' },
    });
  }

  async create(data: {
    lat: number;
    lng: number;
    address: string;
    note?: string;
    photo_url?: string;
  }): Promise<ParkedCar> {
    const car = this.parkedCarRepository.create(data);
    return this.parkedCarRepository.save(car);
  }

  async remove(id: string): Promise<void> {
    await this.parkedCarRepository.delete(id);
  }
}
