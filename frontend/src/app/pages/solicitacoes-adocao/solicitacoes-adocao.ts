import { Component, inject, signal } from '@angular/core';

import {
  SolicitacaoAdocao,
  SolicitacoesAdocaoService
} from '../../services/solicitacoes-adocao';

import { Header } from '../../shared/header/header';

import { AdminHeader } from '../../shared/admin-header/admin-header';

@Component({
  selector: 'app-solicitacoes-adocao',

  imports: [
    Header,
    AdminHeader
  ],

  templateUrl: './solicitacoes-adocao.html',

  styleUrl: './solicitacoes-adocao.css',
})

export class SolicitacoesAdocao {

  private solicitacoesService =
    inject(SolicitacoesAdocaoService);

  solicitacoes =
    signal<SolicitacaoAdocao[]>([]);

  carregando = signal(true);

  erro = signal('');

  solicitacaoSelecionada =
    signal<SolicitacaoAdocao | null>(null);


  constructor() {

    this.carregarSolicitacoes();

  }


  carregarSolicitacoes(): void {

    this.carregando.set(true);

    this.erro.set('');

    this.solicitacoesService
      .getSolicitacoes()
      .subscribe({

        next: (solicitacoes) => {

          this.solicitacoes.set(
            solicitacoes
          );

          this.carregando.set(false);

        },

        error: (erro) => {

          console.error(
            'Erro ao buscar solicitações:',
            erro
          );

          this.erro.set(
            'Não foi possível carregar as solicitações de adoção.'
          );

          this.carregando.set(false);

        }

      });

  }


  selecionarSolicitacao(
    solicitacao: SolicitacaoAdocao
  ): void {

    this.solicitacaoSelecionada.set(
      solicitacao
    );

  }


  fecharDetalhes(): void {

    this.solicitacaoSelecionada.set(null);

  }


  atualizarStatus(
    solicitacao: SolicitacaoAdocao,
    status: string
  ): void {

    if (!solicitacao.id) {

      return;

    }

    this.solicitacoesService
      .atualizarStatus(
        solicitacao.id,
        status
      )
      .subscribe({

        next: (solicitacaoAtualizada) => {

          this.solicitacoes.update(
            lista =>
              lista.map(item =>
                item.id === solicitacaoAtualizada.id
                  ? {
                      ...item,
                      ...solicitacaoAtualizada
                    }
                  : item
              )
          );

          this.solicitacaoSelecionada.set(
            solicitacaoAtualizada
          );

        },

        error: (erro) => {

          console.error(
            'Erro ao atualizar status:',
            erro
          );

          this.erro.set(
            'Não foi possível atualizar o status da solicitação.'
          );

        }

      });

  }


  excluirSolicitacao(
    solicitacao: SolicitacaoAdocao
  ): void {

    if (!solicitacao.id) {

      return;

    }

    const confirmar = window.confirm(
      'Deseja realmente excluir esta solicitação de adoção?'
    );

    if (!confirmar) {

      return;

    }

    this.solicitacoesService
      .excluirSolicitacao(
        solicitacao.id
      )
      .subscribe({

        next: () => {

          this.solicitacoes.update(
            lista =>
              lista.filter(
                item =>
                  item.id !== solicitacao.id
              )
          );

          this.solicitacaoSelecionada.set(
            null
          );

        },

        error: (erro) => {

          console.error(
            'Erro ao excluir solicitação:',
            erro
          );

          this.erro.set(
            'Não foi possível excluir a solicitação.'
          );

        }

      });

  }

}