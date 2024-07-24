import { Test, TestingModule } from '@nestjs/testing';
import { AlertaService } from './alerta.service';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { TipoAlertaEnum } from './enumTipo.enum.ts/enumTipo';
import { Usuario } from '../usuario/entities/usuario.entity';
import { TemaService } from '../tema/tema.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Alerta } from './entities/alerta.entity';
import { BadRequestException } from '@nestjs/common';

describe('AlertaService', () => {
  let service: AlertaService;
  let temaService: TemaService;
  let usuarioService: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertaService,
        {
          provide: TemaService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: UsuarioService,
          useValue: {
            findOne: jest.fn(),
            getAllUsersByTopic: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AlertaService>(AlertaService);
    temaService = module.get<TemaService>(TemaService);
    usuarioService = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should register an alert', () => {

      const createAlertaDto: CreateAlertaDto = {
        mensaje: 'Alerta de prueba',
        tipoAlerta: TipoAlertaEnum.Urgente,
        tema: { id: '1', nombre: 'Deportes', activo: true },
      };

      const users: Usuario[] = [
        { id: '1', nombre: 'Martiniano', apellido: 'Juarroz', dni: '444444444', temas: [] },
        { id: '2', nombre: 'Juan', apellido: 'Perez', dni: '444444443', temas: [] },
      ];
      
      jest.spyOn(temaService, 'findOne').mockReturnValue(createAlertaDto.tema);
      jest.spyOn(usuarioService, 'getAllUsersByTopic').mockReturnValue(users);

      const result = service.sendAlert(createAlertaDto);

      expect(result).toBeInstanceOf(Alerta);
      expect(result.mensaje).toBe(createAlertaDto.mensaje);
      expect(result.tipoAlerta).toBe(createAlertaDto.tipoAlerta);
      expect(result.tema).toBe(createAlertaDto.tema);
      expect(result.esIndividual).toBe(false);
      expect(result.usuarios).toEqual(users);
      expect(temaService.findOne).toHaveBeenCalledWith(createAlertaDto.tema.id);
      expect(usuarioService.getAllUsersByTopic).toHaveBeenCalledWith(createAlertaDto.tema.id);
    });

    it('should create and send an individual alert', () => {
      const createAlertaDto: CreateAlertaDto = {
        mensaje: 'Alerta prueba',
        tipoAlerta: TipoAlertaEnum.Informativa,
        tema: { id: '1', nombre: 'Deportes', activo: true },
        userId: '1',
        fechaHoraExpiracion: new Date(),
      };
      const user: Usuario = { id: '1', nombre: 'Martiniano', apellido: 'Juarroz', dni: '444444444', temas: [] };
      
      jest.spyOn(temaService, 'findOne').mockReturnValue(createAlertaDto.tema);
      jest.spyOn(usuarioService, 'findOne').mockReturnValue(user);

      const result = service.sendAlert(createAlertaDto);

      expect(result).toBeInstanceOf(Alerta);
      expect(result.mensaje).toBe(createAlertaDto.mensaje);
      expect(result.tipoAlerta).toBe(createAlertaDto.tipoAlerta);
      expect(result.tema).toBe(createAlertaDto.tema);
      expect(result.fechaHoraExpiracion).toBe(createAlertaDto.fechaHoraExpiracion);
      expect(result.esIndividual).toBe(true);
      expect(result.usuarios).toEqual([user]);
      expect(temaService.findOne).toHaveBeenCalledWith(createAlertaDto.tema.id);
      expect(usuarioService.findOne).toHaveBeenCalledWith(createAlertaDto.userId);
    });

    it('should throw BadRequestException if tema does not exist', () => {
      const createAlertaDto: CreateAlertaDto = {
        mensaje: 'Alerta prueba',
        tipoAlerta: TipoAlertaEnum.Informativa,
        tema: { id: 'no-existe', nombre: 'No existe', activo: true },
      };
      
      jest.spyOn(temaService, 'findOne').mockReturnValue(null);

      expect(() => service.sendAlert(createAlertaDto)).toThrow(BadRequestException);
      expect(() => service.sendAlert(createAlertaDto)).toThrow('El id del tema ingresado no existe');
    });
  });

  describe('markAlertAsRead', () => {
      it('should mark an alert as read by a user', () => {
        const alertId = '1';
        const userId = '1';
        const user: Usuario = { id: userId, nombre: 'Martiniano', apellido: 'Juarroz', dni: '444444444', temas: [] };
        const alert: Alerta = {
          id: alertId,
          mensaje: 'Alerta prueba',
          tipoAlerta: TipoAlertaEnum.Informativa,
          fechaCreacion: new Date(),
          leidoPor: [],
          tema: { id: '1', nombre: 'Deportes', activo: true },
          esIndividual: false,
          usuarios: [],
        };
  
        jest.spyOn(service, 'findOne').mockReturnValue(alert);
        jest.spyOn(usuarioService, 'findOne').mockReturnValue(user);
  
        const result = service.markAlertAsRead(alertId, userId);
  
        expect(result).toBe(alert);
        expect(result.leidoPor).toContain(user);
        expect(service.findOne).toHaveBeenCalledWith(alertId);
        expect(usuarioService.findOne).toHaveBeenCalledWith(userId);
      });
    });

    describe('findUnreadAlertsForUser', () => {
      it('should return unread, non-expired alerts for a user', () => {
        const userId = '1';
        const user: Usuario = { id: userId, nombre: 'Martiniano', apellido: 'Juarroz', dni: '444444444', temas: [] };
        const alerts: Alerta[] = [
          {
            id: '1',
            mensaje: 'Alert 1',
            tipoAlerta: TipoAlertaEnum.Informativa,
            fechaCreacion: new Date(),
            leidoPor: [],
            tema: { id: '1', nombre: 'Deportes', activo: true },
            esIndividual: false,
            usuarios: [user],
            fechaHoraExpiracion: new Date(Date.now() + 86400000), 
          },
          {
            id: '2',
            mensaje: 'Alert 2',
            tipoAlerta: TipoAlertaEnum.Urgente,
            fechaCreacion: new Date(),
            leidoPor: [user],
            tema: { id: '1', nombre: 'Deportes', activo: true },
            esIndividual: false,
            usuarios: [user],
            fechaHoraExpiracion: new Date(Date.now() + 86400000), 
          },
          {
            id: '3',
            mensaje: 'Alert 3',
            tipoAlerta: TipoAlertaEnum.Informativa,
            fechaCreacion: new Date(),
            leidoPor: [],
            tema: { id: '1', nombre: 'Deportes', activo: true },
            esIndividual: false,
            usuarios: [user],
            fechaHoraExpiracion: new Date(Date.now() - 86400000), 
          },
        ];
  
        jest.spyOn(usuarioService, 'findOne').mockReturnValue(user);
        jest.spyOn(service, 'isExpired').mockImplementation((alert: Alerta) => 
          alert.fechaHoraExpiracion ? new Date(alert.fechaHoraExpiracion) < new Date() : false
        );
        jest.spyOn(service as any, 'orderAlerts').mockImplementation((alerts: Alerta[]) => alerts);
        service['alerts'] = alerts;
  
        const result = service.findUnreadAlertsForUser(userId);
  
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('1');
        expect(usuarioService.findOne).toHaveBeenCalledWith(userId);
        expect(service.isExpired).toHaveBeenCalledTimes(2);
        expect(service['orderAlerts']).toHaveBeenCalled();
      });
    });

  describe('findAllActiveAlertsForATopic', () => {
    it('should return active alerts for an existing topic', () => {
      const topicId = '1';
      const mockAlerts: Alerta[] = [
        {
          id: '1',
          mensaje: 'Alert 1',
          tipoAlerta: TipoAlertaEnum.Informativa,
          fechaCreacion: new Date(),
          leidoPor: [],
          tema: { id: '1', nombre: 'Deportes', activo: true },
          esIndividual: false,
          usuarios: [],
        },
        {
          id: '2',
          mensaje: 'Alert 2',
          tipoAlerta: TipoAlertaEnum.Urgente,
          fechaCreacion: new Date(),
          leidoPor: [],
          tema: { id: '1', nombre: 'Deportes', activo: true },
          esIndividual: false,
          usuarios: [],
          fechaHoraExpiracion: new Date(Date.now() + 86400000), 
        },
        {
          id: '3',
          mensaje: 'Alert 3',
          tipoAlerta: TipoAlertaEnum.Informativa,
          fechaCreacion: new Date(),
          leidoPor: [],
          tema: { id: '1', nombre: 'Deportes', activo: true },
          esIndividual: false,
          usuarios: [],
          fechaHoraExpiracion: new Date(Date.now() - 86400000), 
        },
      ];

      jest.spyOn(temaService, 'findOne').mockReturnValue({ id: topicId, nombre: 'Deportes', activo: true });
      service['alerts'] = mockAlerts; 
      jest.spyOn(service, 'isExpired').mockImplementation((alert: Alerta) => 
        alert.fechaHoraExpiracion ? new Date(alert.fechaHoraExpiracion) < new Date() : false
      );
      jest.spyOn(service as any, 'orderAlerts').mockImplementation((alerts) => alerts);

      const result = service.findAllActiveAlertsForATopic(topicId);

      expect(result).toHaveLength(2);
      expect(result.every(alert => alert.tema.id === topicId)).toBeTruthy();
      expect(service['orderAlerts']).toHaveBeenCalledTimes(1);
    });
  });
});
