import { Component, computed, inject, signal } from '@angular/core';
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

  sexoSelecionado = signal('');
  idadeSelecionada = signal('');

  gatos = signal<Gato[]>([]);

  gatosFiltrados = computed(() => {

    const gatos = this.gatos();
    const sexo = this.sexoSelecionado();
    const idade = this.idadeSelecionada();

    return gatos.filter(gato => {

      const correspondeSexo =
        sexo === '' ||
        gato.sexo === sexo;

      const correspondeIdade =
        idade === '' ||
        gato.idade === idade;

      return correspondeSexo && correspondeIdade;
    });

  });

  constructor() {

    this.gatosService.getGatosDisponiveis().subscribe({

      next: (gatos) => {
        this.gatos.set(gatos);
      },

      error: (erro) => {
        console.error('Erro ao buscar gatinhos:', erro);
      }

    });
  }

  filtrarSexo(event: Event): void {

    const select = event.target as HTMLSelectElement;

    this.sexoSelecionado.set(select.value);

  }

  filtrarIdade(event: Event): void {

    const select = event.target as HTMLSelectElement;

    this.idadeSelecionada.set(select.value);

  }

}