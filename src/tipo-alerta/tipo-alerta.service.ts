import { Injectable } from '@nestjs/common';
import { CreateTipoAlertaDto } from './dto/create-tipo-alerta.dto';
import { UpdateTipoAlertaDto } from './dto/update-tipo-alerta.dto';

@Injectable()
export class TipoAlertaService {
  
  create(createTipoAlertaDto: CreateTipoAlertaDto) {
    return 'This action adds a new tipoAlerta';
  }

  findAll() {
    return `This action returns all tipoAlerta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoAlerta`;
  }

  update(id: number, updateTipoAlertaDto: UpdateTipoAlertaDto) {
    return `This action updates a #${id} tipoAlerta`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoAlerta`;
  }
}
