export interface Gato {
  id: number;
  nome: string;
  idade: string;
  sexo: string;
  descricao: string;
  foto: string;
}

export const gatos: Gato[] = [
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