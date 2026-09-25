import { Component, inject, signal } from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';

import { FormsModule, NgForm } from '@angular/forms';

import { Header } from '../../shared/header/header';

import { Gato, GatosService } from '../../services/gatos';

import {
  SolicitacaoAdocao,
  SolicitacoesAdocaoService
} from '../../services/solicitacoes-adocao';

@Component({
  selector: 'app-contato',
  imports: [Header, FormsModule, RouterLink],
  templateUrl: './contato.html',
  styleUrl: './contato.css',
})
export class Contato {

  private route = inject(ActivatedRoute);

  private gatosService = inject(GatosService);

  private solicitacoesService = inject(
    SolicitacoesAdocaoService
  );

  gatos = signal<Gato[]>([]);

  gato = signal<Gato | undefined>(undefined);

  gatoSelecionadoId = '';

  nome = '';

  telefone = '';

  email = '';

  cidade = '';

  idade: number | null = null;

  tipoMoradia = '';

  tipoImovel = '';

  casaTelada: boolean | null = null;

  moradiaSegura: boolean | null = null;

  quantidadeMoradores: number | null = null;

  todosDeAcordo: boolean | null = null;

  possuiOutrosAnimais: boolean | null = null;

  compromissoLongoPrazo: boolean | null = null;

  respeitaTempoAdaptacao: boolean | null = null;

  motivoAdocao = '';

  sobreAdotante = '';

  enviando = false;

  erroEnvio = '';

  sucessoEnvio = false;

  constructor() {

    const id = Number(
      this.route.snapshot.queryParamMap.get('gato')
    );

    if (id) {

      this.gatosService.getGatoPorId(id).subscribe({

        next: (gato) => {

          this.gato.set(gato);

          this.gatoSelecionadoId = String(gato.id);

        },

        error: (erro) => {

          console.error(
            'Erro ao buscar gatinho:',
            erro
          );

        }

      });

      return;

    }

    this.gatosService.getGatosDisponiveis().subscribe({

      next: (gatos) => {

        this.gatos.set(gatos);

      },

      error: (erro) => {

        console.error(
          'Erro ao buscar gatinhos:',
          erro
        );

      }

    });

  }

  selecionarGato(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    this.gatoSelecionadoId = select.value;

    if (!this.gatoSelecionadoId) {

      this.gato.set(undefined);

      return;

    }

    const gatoId =
      Number(this.gatoSelecionadoId);

    const gatoSelecionado =
      this.gatos().find(
        gato => gato.id === gatoId
      );

    this.gato.set(gatoSelecionado);

  }

  somenteNumeros(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const numeros = input.value
      .replace(/\D/g, '')
      .slice(0, 11);

    input.value = numeros;

    this.telefone = numeros;

  }

  enviar(form: NgForm): void {

    this.erroEnvio = '';

    this.sucessoEnvio = false;

    if (form.invalid) {

      return;

    }

    if (
      this.idade === null ||
      this.quantidadeMoradores === null ||
      this.casaTelada === null ||
      this.moradiaSegura === null ||
      this.todosDeAcordo === null ||
      this.possuiOutrosAnimais === null ||
      this.compromissoLongoPrazo === null ||
      this.respeitaTempoAdaptacao === null
    ) {

      this.erroEnvio =
        'Preencha todos os campos obrigatórios antes de enviar.';

      return;

    }

    this.enviando = true;

    const gatoId = this.gato()
      ? this.gato()!.id
      : this.gatoSelecionadoId
        ? Number(this.gatoSelecionadoId)
        : null;

    const solicitacao: SolicitacaoAdocao = {

      gato_id: gatoId,

      nome: this.nome.trim(),

      email: this.email.trim(),

      telefone: this.telefone.trim(),

      cidade: this.cidade.trim(),

      idade: this.idade,

      tipo_moradia: this.tipoMoradia.trim(),

      tipo_imovel: this.tipoImovel.trim(),

      casa_telada: this.casaTelada,

      moradia_segura: this.moradiaSegura,

      quantidade_moradores:
        this.quantidadeMoradores,

      todos_de_acordo:
        this.todosDeAcordo,

      possui_outros_animais:
        this.possuiOutrosAnimais,

      compromisso_longo_prazo:
        this.compromissoLongoPrazo,

      respeita_tempo_adaptacao:
        this.respeitaTempoAdaptacao,

      motivo_adocao:
        this.motivoAdocao.trim(),

      sobre_adotante:
        this.sobreAdotante.trim(),

      mensagem: ''

    };

    this.solicitacoesService
      .enviarSolicitacao(solicitacao)
      .subscribe({

        next: () => {

          this.enviando = false;

          this.sucessoEnvio = true;

          this.nome = '';

          this.telefone = '';

          this.email = '';

          this.cidade = '';

          this.idade = null;

          this.tipoMoradia = '';

          this.tipoImovel = '';

          this.casaTelada = null;

          this.moradiaSegura = null;

          this.quantidadeMoradores = null;

          this.todosDeAcordo = null;

          this.possuiOutrosAnimais = null;

          this.compromissoLongoPrazo = null;

          this.respeitaTempoAdaptacao = null;

          this.motivoAdocao = '';

          this.sobreAdotante = '';

          form.resetForm();

        },

        error: (erro) => {

          console.error(
            'Erro ao enviar solicitação:',
            erro
          );

          this.erroEnvio =
            erro.error?.message ||
            'Não foi possível enviar sua solicitação. Tente novamente.';

          this.enviando = false;

        }

      });

  }

}