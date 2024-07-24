import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoAlertaDto } from './create-tipo-alerta.dto';

export class UpdateTipoAlertaDto extends PartialType(CreateTipoAlertaDto) {}
