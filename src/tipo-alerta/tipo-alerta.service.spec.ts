import { Test, TestingModule } from '@nestjs/testing';
import { TipoAlertaService } from './tipo-alerta.service';

describe('TipoAlertaService', () => {
  let service: TipoAlertaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoAlertaService],
    }).compile();

    service = module.get<TipoAlertaService>(TipoAlertaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
