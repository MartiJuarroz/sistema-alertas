import { Test, TestingModule } from '@nestjs/testing';
import { TemaService } from './tema.service';
import { CreateTemaDto } from './dto/create-tema.dto';
import { Tema } from './entities/tema.entity';

describe('TemaService', () => {
  let service: TemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemaService],
    }).compile();

    service = module.get<TemaService>(TemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should register a topic', () => {

      const createTemaDto: CreateTemaDto = {
        nombre: 'Deportes',
      };

      const topic = service.create(createTemaDto);
      expect(topic.nombre).toBe('Deportes');
      expect(topic.activo).toBe(true);
      expect(topic.id).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return an array of topics', () => {

      const createTemaDto: CreateTemaDto = {
        nombre: 'Deportes',
      };
      const createTemaDto2: CreateTemaDto = {
        nombre: 'Politica',
      };
      service.create(createTemaDto);
      service.create(createTemaDto2);
      const result = service.findAll();
      expect(result).toHaveLength(2);
      expect(result[0].nombre).toBe('Deportes');
      expect(result[1].nombre).toBe('Politica');

    });
  });

  describe('findOne', () => {
    it('should return a tema by id', () => {
      const createTemaDto: CreateTemaDto = {
        nombre: 'Deportes',
      };
      const createdTopic = service.create(createTemaDto);
      const result = service.findOne(createdTopic.id);
      expect(result).toEqual(createdTopic);
    });

    it('should return undefined if tema not found', () => {
      const result = service.findOne('non-existent-id');
      expect(result).toBeUndefined();
    });
  });
});
