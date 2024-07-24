import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { AlertaModule } from './alerta/alerta.module';
import { TemaModule } from './tema/tema.module';
import { TipoAlertaModule } from './tipo-alerta/tipo-alerta.module';

@Module({
  imports: [UsuarioModule, AlertaModule, TemaModule, TipoAlertaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
