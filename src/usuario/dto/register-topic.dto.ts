import { IsArray, IsNotEmpty, IsNumber, IsString, Length } from "class-validator"
import { Tema } from "src/tema/entities/tema.entity"

export class RegisterTopicDto {

    @IsNotEmpty()
    @IsArray()
    temas: Tema[]

}