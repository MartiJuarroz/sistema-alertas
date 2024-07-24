import { Test, TestingModule } from '@nestjs/testing';
import { TipoAlertaController } from './tipo-alerta.controller';
import { TipoAlertaService } from './tipo-alerta.service';

describe('TipoAlertaController', () => {
  let controller: TipoAlertaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoAlertaController],
      providers: [TipoAlertaService],
    }).compile();

    controller = module.get<TipoAlertaController>(TipoAlertaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
