import { Injectable } from '@nestjs/common';
import { CreatePermisionarioDto } from './dto/create-permisionario.dto';
import { UpdatePermisionarioDto } from './dto/update-permisionario.dto';

@Injectable()
export class PermisionariosService {
  create(createPermisionarioDto: CreatePermisionarioDto) {
    return 'This action adds a new permisionario';
  }

  findAll() {
    return `This action returns all permisionarios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permisionario`;
  }

  update(id: number, updatePermisionarioDto: UpdatePermisionarioDto) {
    return `This action updates a #${id} permisionario`;
  }

  remove(id: number) {
    return `This action removes a #${id} permisionario`;
  }
}
