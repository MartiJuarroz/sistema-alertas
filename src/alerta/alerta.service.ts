import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';
import { Alerta } from './entities/alerta.entity';
import { randomUUID } from 'crypto';
import { UsuarioService } from '../usuario/usuario.service';
import { TemaService } from '../tema/tema.service';

@Injectable()
export class AlertaService {

  private alerts: Alerta[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private temaService: TemaService,
    ) {}

  sendAlert(createAlertaDto: CreateAlertaDto) {

    let destinationUsers = []

    const alert = new Alerta();
    alert.id = randomUUID();
    alert.mensaje = createAlertaDto.mensaje
    alert.tipoAlerta = createAlertaDto.tipoAlerta;
    alert.fechaCreacion = new Date()
    alert.leidoPor = []
    
    if (!this.temaService.findOne(createAlertaDto.tema.id)) throw new BadRequestException('El id del tema ingresado no existe')
    
    alert.tema = createAlertaDto.tema;

    if (createAlertaDto.fechaHoraExpiracion) alert.fechaHoraExpiracion = createAlertaDto.fechaHoraExpiracion;

    if (!this.usuarioService.findOne(createAlertaDto.userId) && createAlertaDto.userId) throw new BadRequestException('El id del usuario ingresado no existe')
    
    if (createAlertaDto.userId){
      destinationUsers.push(this.usuarioService.findOne(createAlertaDto.userId))
      alert.esIndividual = true
    } else {
      destinationUsers = this.usuarioService.getAllUsersByTopic(createAlertaDto.tema.id);
      alert.esIndividual = false
    }
    alert.usuarios = destinationUsers;

    this.alerts.push(alert)

    return alert;
  }

  findAll() {
    return this.alerts
  }

  findOne(id: string) {
    return  this.alerts.find(alert => alert.id == id)
  }

  update(id: number, updateAlertaDto: UpdateAlertaDto) {
    return `This action updates a #${id} alerta`;
  }

  remove(id: number) {
    return `This action removes a #${id} alerta`;
  }

  markAlertAsRead(alertId: string, userId: string){

    if (!this.usuarioService.findOne(userId)) throw new BadRequestException('El id de usuario no existe')

    const alert = this.findOne(alertId)

    if (alert) {
      const user = this.usuarioService.findOne(userId)
      alert.leidoPor.push(user);
    } else {
      throw new BadRequestException('El id de la alerta no existe')
    }

    return alert;

  }

  findUnreadAlertsForUser(userId: string){

    if (!this.usuarioService.findOne(userId)) throw new BadRequestException('El id de usuario no existe')

    let userAlerts: Alerta[] = []
    for (const alert of this.alerts){
      if (alert.usuarios?.find(user => user.id == userId) && !(alert.leidoPor.find(us  => us.id == userId)) && !this.isExpired(alert)) userAlerts.push(alert)
    }

    return this.orderAlerts(userAlerts)

  }

  findAllActiveAlertsForATopic(topicId: string){

    if (!this.temaService.findOne(topicId)) throw new BadRequestException('El id del tema no existe')

    const alertas =  this.alerts.filter(alert => alert.tema.id == topicId && !this.isExpired(alert))
    return this.orderAlerts(alertas)

  }

  orderAlerts(alerts: Alerta[]){

   return alerts.sort((a, b) => {
    // Separar por tipo
    if (a.tipoAlerta !== b.tipoAlerta) {
      // Urgente primero
      return a.tipoAlerta === 'Urgente' ? -1 : 1;
    }
    
    // Si son del mismo tipo, ordenamos por fecha y tipo de cola
    if (a.tipoAlerta === 'Urgente') {
      return b.fechaCreacion.getTime() - a.fechaCreacion.getTime();
    } else {
      return a.fechaCreacion.getTime() - b.fechaCreacion.getTime();
    }
  });

  }

  isExpired(alert: Alerta): boolean {
    return (alert.fechaHoraExpiracion != null && new Date(alert.fechaHoraExpiracion) < new Date());
  }

}
