import { IsNotEmpty, IsString } from "class-validator";

export class CreateTemaDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

}
