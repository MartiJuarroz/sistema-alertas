import { Module } from '@nestjs/common';
import { TipoAlertaService } from './tipo-alerta.service';
import { TipoAlertaController } from './tipo-alerta.controller';

@Module({
  controllers: [TipoAlertaController],
  providers: [TipoAlertaService],
})
export class TipoAlertaModule {}
