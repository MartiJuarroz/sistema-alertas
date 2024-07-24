import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { randomUUID } from 'crypto';
import { Tema } from 'src/tema/entities/tema.entity';
import { TemaService } from '../tema/tema.service';

@Injectable()
export class UsuarioService {

  private usuarios: Usuario[] = [];

  constructor(
    private readonly temaService: TemaService,
  ) {}

  create(createUsuarioDto: CreateUsuarioDto) {

    if (!this.usuarios.some(user => user.dni === createUsuarioDto.dni)) {
      const usuario = new Usuario()
      usuario.id = randomUUID()
      usuario.nombre = createUsuarioDto.nombre;
      usuario.apellido = createUsuarioDto.apellido;
      usuario.dni = createUsuarioDto.dni;
      this.usuarios.push(usuario);
      return usuario;
    } else {
      throw new BadRequestException('DNI ya registrado');
    }
    
  }

  findAll() {
    return this.usuarios
  }

  findOne(id: string) {
    return this.usuarios.find( user => user.id === id )
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }

  getAllUsersByTopic(id: string){
    let users = []
    for (const user of this.usuarios){
      if (user.temas?.find(tema => tema.id == id)) users.push(user)
    }
    return users
  }

  addTopicsToUser(topicList: Tema[], userId: string){

    if (!this.validateExistingTopic(topicList)) throw new BadRequestException('El id del tema ingresado no existe')

    const user = this.findOne(userId);
    
    for (const tema of topicList){
      if (!user.temas.includes(tema)) user.temas.push(tema)
    }

    return user;
  }

  deleteTopicsToUser(topicList: Tema[], userId: string){

    if (!this.validateExistingTopic(topicList)) throw new BadRequestException('El id del tema ingresado no existe')

    const user = this.findOne(userId)

    user.temas = user.temas.filter(topic => !topicList.includes(topic));

    return user;
  }

  changeTopicsToUser(topicList: Tema[], userId: string){
   
    if (!this.validateExistingTopic(topicList)) throw new BadRequestException('El id del tema ingresado no existe')

    const user = this.findOne(userId);

    user.temas = topicList;

    return user;
  }

  validateExistingTopic(topics: Tema[]){
    let valid = true
    for (const topic of topics){
      if (!this.temaService.findAll().find(top => top.id == topic.id)) valid = false
    }
    return valid
  }
}
