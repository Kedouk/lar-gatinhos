import { Injectable } from '@angular/core';

export interface Gato {
  id: number;
  nome: string;
  idade: string;
  sexo: string;
  descricao: string;
  foto: string;
}

@Injectable({
  providedIn: 'root'
})
export class GatosService {

  private gatos: Gato[] = [
    {
      id: 1,
      nome: 'Nome do gatinho',
      idade: 'Filhote',
      sexo: 'Fêmea',
      descricao: 'Breve descrição do gatinho.',
      foto: 'gato-hero.png'
    },
    {
      id: 2,
      nome: 'Nome do gatinho',
      idade: 'Adulto',
      sexo: 'Macho',
      descricao: 'Breve descrição do gatinho.',
      foto: 'gato-hero.png'
    },
    {
      id: 3,
      nome: 'Nome do gatinho',
      idade: 'Filhote',
      sexo: 'Macho',
      descricao: 'Breve descrição do gatinho.',
      foto: 'gato-hero.png'
    }
  ];

  getGatos(): Gato[] {
    return this.gatos;
  }

  getGatoPorId(id: number): Gato | undefined {
    return this.gatos.find(gato => gato.id === id);
  }

}