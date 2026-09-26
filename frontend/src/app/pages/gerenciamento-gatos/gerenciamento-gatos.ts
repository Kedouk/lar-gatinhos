import { Component, computed, inject, signal } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { RouterLink } from '@angular/router';

import { Header } from '../../shared/header/header';

import { Gato, GatosService } from '../../services/gatos';

@Component({
  selector: 'app-gerenciamento-gatos',

  imports: [Header, RouterLink],

  templateUrl: './gerenciamento-gatos.html',

  styleUrl: './gerenciamento-gatos.css',
})
export class GerenciamentoGatos {

  private gatosService = inject(GatosService);

  gatos = signal<Gato[]>([]);

  carregando = signal(true);

  erro = signal(false);

  paginaAtual = signal(1);

  readonly gatosPorPagina = 12;

  excluindoId = signal<number | null>(null);

  erroExclusao = signal('');


  totalPaginas = computed(() =>
    Math.ceil(
      this.gatos().length / this.gatosPorPagina
    )
  );


  gatosPaginados = computed(() => {

    const inicio =
      (this.paginaAtual() - 1) * this.gatosPorPagina;

    const fim =
      inicio + this.gatosPorPagina;

    return this.gatos().slice(inicio, fim);

  });


  paginas = computed(() =>
    Array.from(
      { length: this.totalPaginas() },
      (_, indice) => indice + 1
    )
  );


  constructor() {

    this.carregarGatos();

  }


  carregarGatos(): void {

    this.carregando.set(true);

    this.erro.set(false);

    this.gatosService.getGatos().subscribe({

      next: (gatos) => {

        this.gatos.set(gatos);

        this.paginaAtual.set(1);

        this.carregando.set(false);

      },

      error: (erro) => {

        console.error(
          'Erro ao buscar os gatos:',
          erro
        );

        this.erro.set(true);

        this.carregando.set(false);

      }

    });

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


  excluirGato(gato: Gato): void {

    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o gatinho ${gato.nome}?`
    );

    if (!confirmar) {

      return;

    }

    this.excluindoId.set(gato.id);

    this.erroExclusao.set('');


    this.gatosService
      .excluirGato(gato.id)
      .subscribe({

        next: () => {

          this.gatos.update(gatos =>
            gatos.filter(
              item => item.id !== gato.id
            )
          );

          this.excluindoId.set(null);

          const totalPaginas =
            this.totalPaginas();

          if (
            this.paginaAtual() > totalPaginas &&
            totalPaginas > 0
          ) {

            this.paginaAtual.set(totalPaginas);

          }

        },

        error: (erro: HttpErrorResponse) => {

          console.error(
            'Erro ao excluir gatinho:',
            erro
          );

          const mensagem =
            erro.error?.message ||
            'Não foi possível excluir o gatinho. Tente novamente.';

          this.erroExclusao.set(mensagem);

          this.excluindoId.set(null);

          window.alert(mensagem);

        }

      });

  }

}