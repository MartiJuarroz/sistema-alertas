import { IsEnum, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Tema } from "src/tema/entities/tema.entity";
import { TipoAlertaEnum } from "../enumTipo.enum.ts/enumTipo";

export class CreateAlertaDto {

    @IsNotEmpty()
    @IsString()
    mensaje: string;

    @IsOptional()
    fechaHoraExpiracion?: Date;

    @IsNotEmpty()
    @IsString()
    @IsIn(['Informativa','Urgente'])
    tipoAlerta: TipoAlertaEnum;

    @IsNotEmpty()
    tema: Tema;

    @IsOptional()
    userId?: string;

}
