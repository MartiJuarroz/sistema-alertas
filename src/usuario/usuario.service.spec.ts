import { Test, TestingModule } from '@nestjs/testing';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UsuarioService } from './usuario.service';
import { Tema } from 'src/tema/entities/tema.entity';
import { Usuario } from './entities/usuario.entity';
import { TemaService } from '../tema/tema.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let temaService: TemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: TemaService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    temaService = module.get<TemaService>(TemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should register a user', () => {

      const createUsertDto: CreateUsuarioDto = {
        nombre: 'Martiniano',
        apellido: 'Juarroz',
        dni: '444444444'
      };

      const user = service.create(createUsertDto);
      expect(user.nombre).toBe('Martiniano');
      expect(user.apellido).toBe('Juarroz');
      expect(user.dni).toBe('444444444');
      expect(user.id).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', () => {

      const createUsertDto: CreateUsuarioDto = {
        nombre: 'Martiniano',
        apellido: 'Juarroz',
        dni: '444444444'
      };
      const createUsertDto2: CreateUsuarioDto = {
        nombre: 'Juan',
        apellido: 'Perez',
        dni: '444444443'
      };
      service.create(createUsertDto);
      service.create(createUsertDto2);
      const result = service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].nombre).toBe('Martiniano');
      expect(result[0].dni).toBe('444444444');
      expect(result[1].nombre).toBe('Juan');
      expect(result[1].dni).toBe('444444443');

    });
  });

  describe('findOne', () => {
    it('should return a tema by id', () => {
      const createUsertDto: CreateUsuarioDto = {
        nombre: 'Martiniano',
        apellido: 'Juarroz',
        dni: '444444444'
      };
      const createdUser = service.create(createUsertDto);
      const result = service.findOne(createdUser.id);
      expect(result).toEqual(createdUser);
    });

    it('should return undefined if tema not found', () => {
      const result = service.findOne('non-existent-id');
      expect(result).toBeUndefined();
    });
  });

  describe('getAllUsersByTopic', () => {
    it('should return users with the specified topic', () => {
      const tema1: Tema = { id: '1', nombre: 'Deportes', activo: true };
      const tema2: Tema = { id: '2', nombre: 'Politica', activo: true };

      const user1: Usuario = { id: '1', nombre: 'Martiniano', apellido: 'Juarroz', dni: '444444444', temas: [tema1] };
      const user2: Usuario = { id: '2', nombre: 'Juan', apellido: 'Perez', dni: '444444443', temas: [tema1, tema2] };
      const user3: Usuario = { id: '3', nombre: 'Pedro', apellido: 'Suarez', dni: '444444442', temas: [tema2] };

      service['usuarios'] = [user1, user2, user3];

      const result = service.getAllUsersByTopic('1');

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(user1);
      expect(result).toContainEqual(user2);
      expect(result).not.toContainEqual(user3);
    });

    it('should return an empty array if no users have the specified topic', () => {
      const tema: Tema = { id: '1', nombre: 'Deportes', activo: true };
      const user: Usuario = { id: '1', nombre: 'Martiniano', apellido: 'Juarroz', dni: '444444444', temas: [tema] };

      service['usuarios'] = [user];

      const result = service.getAllUsersByTopic('2');

      expect(result).toHaveLength(0);
    });

    it('should handle users with no topics', () => {

      const user: Usuario = { id: '1', nombre: 'Martiniano', apellido: 'Juarroz', dni: '444444444', temas: undefined };

      service['usuarios'] = [user];

      const result = service.getAllUsersByTopic('1');

      expect(result).toHaveLength(0);
    });
  });

  describe('changeTopicsToUser', () => {
    it('should change topics for a user', () => {
      const userId = '1';
      const tema1: Tema = { id: '1', nombre: 'Deportes', activo: true };
      const tema2: Tema = { id: '2', nombre: 'Politica', activo: true };
      const topicList: Tema[] = [tema1, tema2];
      
      const user: Usuario = { id: userId, nombre: 'Martiniano', apellido: 'Juarroz', dni: '444444444', temas: [] };
      
      jest.spyOn(service, 'findOne').mockReturnValue(user);
      jest.spyOn(service, 'validateExistingTopic').mockReturnValue(true);

      const result:any = service.changeTopicsToUser(topicList, userId);

      expect(result).toBe(user);
      expect(result.temas).toEqual(topicList);
      expect(service.findOne).toHaveBeenCalledWith(userId);
      expect(service.validateExistingTopic).toHaveBeenCalledWith(topicList);
    });

    it('should handle user not found', () => {
      // Arrange
      const userId = 'non-existent';
      const topicList: Tema[] = [{ id: '1', nombre: 'Deportes', activo: true }];
      
      jest.spyOn(service, 'validateExistingTopic').mockReturnValue(true);
      jest.spyOn(service, 'findOne').mockReturnValue(undefined);

      // Act & Assert
      expect(() => service.changeTopicsToUser(topicList, userId)).toThrow();
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });


});
