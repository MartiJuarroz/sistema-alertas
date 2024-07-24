import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTemaDto } from './dto/create-tema.dto';
import { UpdateTemaDto } from './dto/update-tema.dto';
import { Tema } from './entities/tema.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class TemaService {

  private temas: Tema[] = [];

  create(createTemaDto: CreateTemaDto) {

    if (this.findAll().find(topic => topic.nombre == createTemaDto.nombre)){
      throw new BadRequestException('Ya existe un tema con ese nombre')
    }

    const tema = new Tema()
    tema.id = randomUUID()
    tema.nombre = createTemaDto.nombre;
    tema.activo = true;
    this.temas.push(tema);
    return tema;

  }

  findAll() {
    return this.temas
  }

  findOne(id: string) {
    return this.temas.find(tema => tema.id == id)
  }

  update(id: number, updateTemaDto: UpdateTemaDto) {
    return `This action updates a #${id} tema`;
  }

  remove(id: number) {
    return `This action removes a #${id} tema`;
  }

}
