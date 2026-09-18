import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Header } from '../../shared/header/header';
import {
  SolicitacaoAdocao,
  SolicitacoesAdocaoService
} from '../../services/solicitacoes-adocao';

@Component({
  selector: 'app-solicitacoes-adocao',
  imports: [DatePipe, Header],
  templateUrl: './solicitacoes-adocao.html',
  styleUrl: './solicitacoes-adocao.css',
})
export class SolicitacoesAdocao {

  private solicitacoesService = inject(SolicitacoesAdocaoService);

  solicitacoes = signal<SolicitacaoAdocao[]>([]);
  statusSelecionado = signal('');
  carregando = signal(true);
  erro = signal(false);

  paginaAtual = signal(1);

  readonly solicitacoesPorPagina = 12;

  atualizandoId = signal<number | null>(null);

  solicitacoesFiltradas = computed(() => {

    const solicitacoes = this.solicitacoes();
    const status = this.statusSelecionado();

    if (!status) {
      return solicitacoes;
    }

    return solicitacoes.filter(
      solicitacao => solicitacao.status === status
    );

  });

  totalPaginas = computed(() =>
    Math.ceil(
      this.solicitacoesFiltradas().length /
      this.solicitacoesPorPagina
    )
  );

  solicitacoesPaginadas = computed(() => {

    const inicio =
      (this.paginaAtual() - 1) *
      this.solicitacoesPorPagina;

    const fim =
      inicio + this.solicitacoesPorPagina;

    return this.solicitacoesFiltradas().slice(inicio, fim);

  });

  paginas = computed(() =>
    Array.from(
      { length: this.totalPaginas() },
      (_, indice) => indice + 1
    )
  );

  constructor() {

    this.carregarSolicitacoes();

  }

  carregarSolicitacoes(): void {

    this.carregando.set(true);
    this.erro.set(false);

    this.solicitacoesService.getSolicitacoes().subscribe({

      next: (solicitacoes) => {

        this.solicitacoes.set(solicitacoes);
        this.paginaAtual.set(1);
        this.carregando.set(false);

      },

      error: (erro) => {

        console.error(
          'Erro ao buscar solicitações:',
          erro
        );

        this.erro.set(true);
        this.carregando.set(false);

      }

    });

  }

  filtrarStatus(event: Event): void {

    const select = event.target as HTMLSelectElement;

    this.statusSelecionado.set(select.value);
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

  alterarStatus(
    solicitacao: SolicitacaoAdocao,
    event: Event
  ): void {

    const select = event.target as HTMLSelectElement;
    const novoStatus = select.value;

    if (
      !solicitacao.id ||
      !novoStatus ||
      this.atualizandoId() !== null
    ) {
      return;
    }

    this.atualizandoId.set(solicitacao.id);

    this.solicitacoesService
      .atualizarStatus(
        solicitacao.id,
        novoStatus
      )
      .subscribe({

        next: (solicitacaoAtualizada) => {

          this.solicitacoes.update(solicitacoes =>
            solicitacoes.map(item =>
              item.id === solicitacaoAtualizada.id
                ? {
                    ...item,
                    status: solicitacaoAtualizada.status
                  }
                : item
            )
          );

          this.atualizandoId.set(null);

        },

        error: (erro) => {

          console.error(
            'Erro ao atualizar status:',
            erro
          );

          this.atualizandoId.set(null);

          this.carregarSolicitacoes();

        }

      });

  }

}