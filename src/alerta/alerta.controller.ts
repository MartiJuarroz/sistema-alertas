import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AlertaService } from './alerta.service';
import { CreateAlertaDto } from './dto/create-alerta.dto';
import { UpdateAlertaDto } from './dto/update-alerta.dto';
import { MarkAlertReadDto } from './dto/mark-alerta-read.dto';

@Controller('alerta')
export class AlertaController {
  constructor(private readonly alertaService: AlertaService) {}

  @Post()
  sendAlert(@Body() createAlertaDto: CreateAlertaDto) {
    return this.alertaService.sendAlert(createAlertaDto);
  }

  @Get()
  findAll() {
    return this.alertaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.alertaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlertaDto: UpdateAlertaDto) {
    return this.alertaService.update(+id, updateAlertaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.alertaService.remove(+id);
  }

  @Post('marcar_leida/:id')
  markAlertRead(@Param('id') id: string, @Body() markAlertReadDto: MarkAlertReadDto) {
    return this.alertaService.markAlertAsRead(id, markAlertReadDto.userId);
  }

  @Get('alertas_sin_leer/:userId')
  findUnreadAlertsForUser(@Param('userId') userId: string) {
    return this.alertaService.findUnreadAlertsForUser(userId);
  }

  @Get('alertas_tema/:topicId')
  findAlertsForATopic(@Param('topicId') topicId: string) {
    return this.alertaService.findAllActiveAlertsForATopic(topicId);
  }


}
