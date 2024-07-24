import { Tema } from "src/tema/entities/tema.entity";

export class Usuario {

    id: string;

    nombre: string;

    apellido: string;

    dni: string;

    // lo hice asi porq no hay db pero sino habria que hacer una tabla intermedia porque estaria mal guardar el usuario_id en la tabla Tema
    temas: Tema[]
}
