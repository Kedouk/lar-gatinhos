import { Injectable } from '@angular/core';

export interface Gato {
  id: number;
  nome: string;
  idade: string;
  sexo: string;
  descricao: string;
  foto: string;
  personalidade: string;
  castrado: boolean;
  vacinado: boolean;
  disponivel: boolean;
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
      foto: 'gato-hero.png',
      personalidade: 'Carinhosa e brincalhona.',
      castrado: false,
      vacinado: true,
      disponivel: true
    },
    {
      id: 2,
      nome: 'Nome do gatinho',
      idade: 'Adulto',
      sexo: 'Macho',
      descricao: 'Breve descrição do gatinho.',
      foto: 'gato-hero.png',
      personalidade: 'Tranquilo e carinhoso.',
      castrado: true,
      vacinado: true,
      disponivel: true
    },
    {
      id: 3,
      nome: 'Nome do gatinho',
      idade: 'Filhote',
      sexo: 'Macho',
      descricao: 'Breve descrição do gatinho.',
      foto: 'gato-hero.png',
      personalidade: 'Brincalhão e curioso.',
      castrado: false,
      vacinado: true,
      disponivel: true
    }
  ];

  getGatos(): Gato[] {
    return this.gatos;
  }

  getGatosDisponiveis(): Gato[] {
    return this.gatos.filter(gato => gato.disponivel);
  }

  getGatoPorId(id: number): Gato | undefined {
    return this.gatos.find(gato => gato.id === id);
  }

  adicionarGato(gato: Omit<Gato, 'id'>): void {
    const novoId = this.gatos.length > 0
      ? Math.max(...this.gatos.map(gato => gato.id)) + 1
      : 1;

    this.gatos.push({
      id: novoId,
      ...gato
    });
  }

}