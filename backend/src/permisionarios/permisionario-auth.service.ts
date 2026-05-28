import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permisionario } from './entities/permisionario.entity';
import * as bcrypt from 'bcrypt';

export interface TicketMemoria {
  id: string;
  codigo: string;
  patente: string;
  tipo_vehiculo: string;
  horas: number;
  tarifa_hora: number;
  monto_original: number;
  descuento: number;
  monto_total: number;
  metodo_pago: string;
  hora_inicio: string;
  hora_fin: string;
  estado: string;
  permisionario_id: string;
}

@Injectable()
export class PermisionarioAuthService {

  private tickets: TicketMemoria[] = [];

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

  emitirTicket(body: { patente: string; tipo_vehiculo: string; horas: number; metodo_pago: string }, permisionarioId: string) {
    const tarifas: Record<string, number> = { auto: 700, moto: 300 };
    const tarifa = tarifas[body.tipo_vehiculo] ?? 700;
    const montoOriginal = tarifa * body.horas;
    const esDigital = body.metodo_pago === 'digital';
    const descuento = esDigital ? Math.round(montoOriginal * 0.20) : 0;
    const montoTotal = montoOriginal - descuento;
    const ahora = new Date();
    const horaFin = new Date(ahora.getTime() + body.horas * 60 * 60 * 1000);

    const ticket: TicketMemoria = {
      id: `TKT-${Date.now()}`,
      codigo: `EST-${Date.now().toString().slice(-8)}`,
      patente: body.patente.toUpperCase(),
      tipo_vehiculo: body.tipo_vehiculo,
      horas: body.horas,
      tarifa_hora: tarifa,
      monto_original: montoOriginal,
      descuento,
      monto_total: montoTotal,
      metodo_pago: body.metodo_pago,
      hora_inicio: ahora.toISOString(),
      hora_fin: horaFin.toISOString(),
      estado: 'activo',
      permisionario_id: permisionarioId,
    };

    this.tickets.push(ticket);
    return { ticket };
  }

  getCuadra() {
    const ahora = new Date();
    const activos = this.tickets.filter(
      (t) => t.estado === 'activo' && new Date(t.hora_fin) > ahora,
    );
    const hoy = ahora.toDateString();
    const ticketsHoy = this.tickets.filter(
      (t) => new Date(t.hora_inicio).toDateString() === hoy,
    );
    const recaudacionHoy = ticketsHoy.reduce((sum, t) => sum + t.monto_total, 0);

    return {
      zona: { nombre: 'Zona Centro', cuadras: 'Caseros 100-500 · Mitre 200-400' },
      recaudacion_hoy: recaudacionHoy,
      tickets_hoy: ticketsHoy.length,
      total_activos: activos.length,
      vehiculos_activos: activos.map((t) => ({
        id: t.id,
        patente: t.patente,
        tipo_vehiculo: t.tipo_vehiculo,
        minutos_restantes: Math.max(0, Math.floor((new Date(t.hora_fin).getTime() - ahora.getTime()) / 60000)),
      })),
    };
  }

  getHistorial() {
    const hoy = new Date().toDateString();
    const ticketsHoy = this.tickets.filter(
      (t) => new Date(t.hora_inicio).toDateString() === hoy,
    );
    const efectivoTotal = ticketsHoy.filter((t) => t.metodo_pago === 'efectivo').reduce((s, t) => s + t.monto_total, 0);
    const digitalTotal = ticketsHoy.filter((t) => t.metodo_pago === 'digital').reduce((s, t) => s + t.monto_total, 0);
    const totalRecaudado = efectivoTotal + digitalTotal;
    const montoPermisionario = Math.round(totalRecaudado * 0.70);

    return {
      liquidacion: {
        total_recaudado: totalRecaudado,
        monto_permisionario: montoPermisionario,
        efectivo_recibido: efectivoTotal,
        digital_recibido: digitalTotal,
        debe_entregar: totalRecaudado - montoPermisionario,
      },
      resumen: { total_tickets: ticketsHoy.length },
      tickets: ticketsHoy,
    };
  }
}
