import { Module } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { AlertaController } from './alerta.controller';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { TemaModule } from 'src/tema/tema.module';

@Module({
  imports: [UsuarioModule, TemaModule],
  controllers: [AlertaController],
  providers: [AlertaService],
  exports: [AlertaService]
})
export class AlertaModule {}
