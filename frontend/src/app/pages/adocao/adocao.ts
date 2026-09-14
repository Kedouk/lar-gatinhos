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

  paginaAtual = signal(1);

  readonly gatosPorPagina = 12;

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

  totalPaginas = computed(() =>
    Math.ceil(
      this.gatosFiltrados().length / this.gatosPorPagina
    )
  );

  gatosPaginados = computed(() => {

    const inicio =
      (this.paginaAtual() - 1) * this.gatosPorPagina;

    const fim =
      inicio + this.gatosPorPagina;

    return this.gatosFiltrados().slice(inicio, fim);

  });

  paginas = computed(() =>
    Array.from(
      { length: this.totalPaginas() },
      (_, indice) => indice + 1
    )
  );

  constructor() {

    this.gatosService.getGatosDisponiveis().subscribe({

      next: (gatos) => {
        this.gatos.set(gatos);
        this.paginaAtual.set(1);
      },

      error: (erro) => {
        console.error('Erro ao buscar gatinhos:', erro);
      }

    });
  }

  filtrarSexo(event: Event): void {

    const select = event.target as HTMLSelectElement;

    this.sexoSelecionado.set(select.value);
    this.paginaAtual.set(1);

  }

  filtrarIdade(event: Event): void {

    const select = event.target as HTMLSelectElement;

    this.idadeSelecionada.set(select.value);
    this.paginaAtual.set(1);

  }

  irParaPagina(pagina: number): void {

    if (
      pagina < 1 ||
      pagina > this.totalPaginas()
    ) {
      return;
    }

    this.paginaAtual.set(pagina);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }

}