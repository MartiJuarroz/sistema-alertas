import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoAlertaService } from './tipo-alerta.service';
import { CreateTipoAlertaDto } from './dto/create-tipo-alerta.dto';
import { UpdateTipoAlertaDto } from './dto/update-tipo-alerta.dto';

@Controller('tipo-alerta')
export class TipoAlertaController {
  constructor(private readonly tipoAlertaService: TipoAlertaService) {}

  @Post()
  create(@Body() createTipoAlertaDto: CreateTipoAlertaDto) {
    return this.tipoAlertaService.create(createTipoAlertaDto);
  }

  @Get()
  findAll() {
    return this.tipoAlertaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoAlertaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoAlertaDto: UpdateTipoAlertaDto) {
    return this.tipoAlertaService.update(+id, updateTipoAlertaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoAlertaService.remove(+id);
  }
}
