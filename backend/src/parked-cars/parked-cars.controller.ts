import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ParkedCarsService } from './parked-cars.service';

@Controller('parked-cars')
export class ParkedCarsController {
  constructor(private readonly parkedCarsService: ParkedCarsService) {}

  @Get()
  async findAll() {
    return this.parkedCarsService.findAll();
  }

  @Post()
  async create(
    @Body()
    body: {
      lat: number;
      lng: number;
      address: string;
      note?: string;
      photo_url?: string;
    },
  ) {
    return this.parkedCarsService.create(body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.parkedCarsService.remove(id);
    return { success: true };
  }
}
