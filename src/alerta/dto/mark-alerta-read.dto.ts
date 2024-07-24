import { IsNotEmpty, IsString } from "class-validator";

export class MarkAlertReadDto {

    @IsNotEmpty()
    @IsString()
    userId: string;

}