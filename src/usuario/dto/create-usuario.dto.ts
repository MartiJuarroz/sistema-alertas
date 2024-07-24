import { IsNotEmpty, IsNumberString, IsString, Length } from "class-validator"

export class CreateUsuarioDto {

    @IsNotEmpty()
    @IsString()
    nombre: string

    @IsNotEmpty()
    @IsString()
    apellido: string

    @IsNotEmpty()
    @IsNumberString({}, { message: 'El valor debe ser un número' })
    @Length(8,9, { message: 'Dni 8 o 9 caracteres' })
    dni: string
}
