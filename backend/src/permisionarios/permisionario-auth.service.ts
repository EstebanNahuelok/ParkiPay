import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permisionario } from './entities/permisionario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PermisionarioAuthService {

  constructor(
    @InjectRepository(Permisionario)
    private readonly repo: Repository<Permisionario>,
  ) {}

  async checkLegajo(numero_legajo: string) {
    const permisionario = await this.repo.findOne({
      where: { legajo: Number(numero_legajo) },
    });
    if (!permisionario) {
      throw new HttpException(
        { error: 'Legajo no encontrado. Verificá el número ingresado.' },
        HttpStatus.NOT_FOUND,
      );
    }
    if (!permisionario.activo) {
      throw new HttpException(
        { error: 'Este legajo está inactivo. Contactá a RRHH.' },
        HttpStatus.FORBIDDEN,
      );
    }
    return {
      nombre: permisionario.nombre,
      apellido: permisionario.apellido,
      sector: permisionario.zonaAsignada?.nombreZona ?? 'Sin zona asignada',
      isRegistered: !!permisionario.pinHash,
    };
  }

  async login(numero_legajo: string, pin: string) {
    const permisionario = await this.repo.findOne({
      where: { legajo: Number(numero_legajo) },
    });
    if (!permisionario) {
      throw new HttpException({ error: 'Legajo no encontrado.' }, HttpStatus.NOT_FOUND);
    }
    if (!permisionario.pinHash) {
      throw new HttpException(
        { error: 'Usuario no registrado. Completá el primer acceso.' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const pinValido = await bcrypt.compare(pin, permisionario.pinHash);
    if (!pinValido) {
      throw new HttpException({ error: 'PIN incorrecto.' }, HttpStatus.UNAUTHORIZED);
    }
    const token = Buffer.from(`${permisionario.id}:${Date.now()}`).toString('base64');
    return {
      token,
      usuario: {
        id: permisionario.id,
        legajo: permisionario.legajo,
        nombre: permisionario.nombre,
        apellido: permisionario.apellido,
      },
    };
  }

  async register(numero_legajo: string, pin: string, dni_ultimos3: string) {
    const permisionario = await this.repo.findOne({
      where: { legajo: Number(numero_legajo) },
    });
    if (!permisionario) {
      throw new HttpException({ error: 'Legajo no encontrado.' }, HttpStatus.NOT_FOUND);
    }
    if (permisionario.pinHash) {
      throw new HttpException(
        { error: 'Este legajo ya tiene una cuenta. Usá la opción de login.' },
        HttpStatus.CONFLICT,
      );
    }
    if (permisionario.dniUltimos3 !== dni_ultimos3) {
      throw new HttpException(
        { error: 'Los últimos 3 dígitos del DNI no coinciden con los registrados en RRHH.' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const pinHash = await bcrypt.hash(pin, 10);
    await this.repo.update(permisionario.id, { pinHash });

    const token = Buffer.from(`${permisionario.id}:${Date.now()}`).toString('base64');
    return {
      token,
      usuario: {
        id: permisionario.id,
        legajo: permisionario.legajo,
        nombre: permisionario.nombre,
        apellido: permisionario.apellido,
      },
    };
  }
}
