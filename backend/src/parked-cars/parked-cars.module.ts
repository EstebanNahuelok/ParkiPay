import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkedCar } from './entities/parked-car.entity';
import { ParkedCarsService } from './parked-cars.service';
import { ParkedCarsController } from './parked-cars.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ParkedCar])],
  providers: [ParkedCarsService],
  controllers: [ParkedCarsController],
  exports: [ParkedCarsService],
})
export class ParkedCarsModule {}
