import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Gato, GatosService } from '../../services/gatos';

@Component({
  selector: 'app-adocao',
  imports: [Header, RouterLink],
  templateUrl: './adocao.html',
  styleUrl: './adocao.css',
})
export class Adocao {
  private gatosService = inject(GatosService);

  sexoSelecionado: string = '';
  idadeSelecionada: string = '';

  gatos: Gato[] = this.gatosService.getGatosDisponiveis();

  get gatosFiltrados(): Gato[] {
    return this.gatos.filter(gato => {
      const correspondeSexo =
        this.sexoSelecionado === '' ||
        gato.sexo === this.sexoSelecionado;

      const correspondeIdade =
        this.idadeSelecionada === '' ||
        gato.idade === this.idadeSelecionada;

      return correspondeSexo && correspondeIdade;
    });
  }

  filtrarSexo(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sexoSelecionado = select.value;
  }

  filtrarIdade(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.idadeSelecionada = select.value;
  }
}