import { Module } from '@nestjs/common';
import { TemaService } from './tema.service';
import { TemaController } from './tema.controller';
import { UsuarioService } from 'src/usuario/usuario.service';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  controllers: [TemaController],
  providers: [TemaService],
  exports: [TemaService]
})
export class TemaModule {}
