import { Component } from '@angular/core';
import { Header } from '../../shared/header/header';

interface Gato {
  id: number;
  nome: string;
  idade: string;
  sexo: string;
  descricao: string;
  foto: string;
}

@Component({
  selector: 'app-adocao',
  imports: [Header],
  templateUrl: './adocao.html',
  styleUrl: './adocao.css',
})
export class Adocao {

}