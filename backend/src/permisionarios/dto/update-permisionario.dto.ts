import { PartialType } from '@nestjs/mapped-types';
import { CreatePermisionarioDto } from './create-permisionario.dto';

export class UpdatePermisionarioDto extends PartialType(CreatePermisionarioDto) {}
