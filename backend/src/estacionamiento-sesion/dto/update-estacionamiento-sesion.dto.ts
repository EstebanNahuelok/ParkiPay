import { PartialType } from '@nestjs/mapped-types';
import { CreateEstacionamientoSesionDto } from './create-estacionamiento-sesion.dto';

export class UpdateEstacionamientoSesionDto extends PartialType(CreateEstacionamientoSesionDto) {}
