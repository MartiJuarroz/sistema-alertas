import { Tema } from "src/tema/entities/tema.entity";
import { TipoAlertaEnum } from "../enumTipo.enum.ts/enumTipo";
import { Usuario } from "src/usuario/entities/usuario.entity";

export class Alerta {

    id: string;
    mensaje: string;
    fechaCreacion: Date;
    fechaHoraExpiracion?: Date;
    esIndividual: boolean;
    leidoPor: Usuario[]
    tema: Tema;
    //deje la clase TipoAlerta hecha modelada pero lo hice con enum para no tener que crear los tipos
    tipoAlerta: TipoAlertaEnum;
    // lo hice asi porq no hay db pero sino habria que hacer una tabla intermedia para guardar el id de la alerta y del usuario
    usuarios: Usuario[];

}
