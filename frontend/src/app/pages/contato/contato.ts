import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Header } from '../../shared/header/header';
import { Gato, GatosService } from '../../services/gatos';
import { SolicitacoesAdocaoService } from '../../services/solicitacoes-adocao';

@Component({
  selector: 'app-contato',
  imports: [Header, FormsModule, RouterLink],
  templateUrl: './contato.html',
  styleUrl: './contato.css',
})
export class Contato {

  private route = inject(ActivatedRoute);
  private gatosService = inject(GatosService);
  private solicitacoesService = inject(SolicitacoesAdocaoService);

  gatos = signal<Gato[]>([]);
  gato = signal<Gato | undefined>(undefined);

  gatoSelecionadoId = '';

  nome = '';
  email = '';
  telefone = '';
  mensagem = '';

  enviando = false;
  erroEnvio = '';
  sucessoEnvio = false;

  constructor() {

    const id = Number(this.route.snapshot.queryParamMap.get('gato'));

    if (id) {

      this.gatosService.getGatoPorId(id).subscribe({

        next: (gato) => {
          this.gato.set(gato);
        },

        error: (erro) => {
          console.error('Erro ao buscar gatinho:', erro);
        }

      });

      return;
    }

    this.gatosService.getGatosDisponiveis().subscribe({

      next: (gatos) => {
        this.gatos.set(gatos);
      },

      error: (erro) => {
        console.error('Erro ao buscar gatinhos:', erro);
      }

    });
  }

  selecionarGato(event: Event): void {

    const select = event.target as HTMLSelectElement;

    this.gatoSelecionadoId = select.value;

    if (!this.gatoSelecionadoId) {
      this.gato.set(undefined);
      return;
    }

    const gatoId = Number(this.gatoSelecionadoId);

    const gatoSelecionado = this.gatos().find(
      gato => gato.id === gatoId
    );

    this.gato.set(gatoSelecionado);

  }

  somenteNumeros(event: Event): void {

    const input = event.target as HTMLInputElement;

    const numeros = input.value
      .replace(/\D/g, '')
      .slice(0, 11);

    input.value = numeros;
    this.telefone = numeros;

  }

  enviar(form: NgForm): void {

    this.erroEnvio = '';
    this.sucessoEnvio = false;

    if (
      form.invalid ||
      (
        !this.gato() &&
        this.gatoSelecionadoId !== ''
      )
    ) {
      return;
    }

    this.enviando = true;

    const gatoId = this.gato()
      ? this.gato()!.id
      : null;

    this.solicitacoesService.enviarSolicitacao({

      gato_id: gatoId,
      nome: this.nome.trim(),
      email: this.email.trim(),
      telefone: this.telefone.trim(),
      mensagem: this.mensagem.trim()

    }).subscribe({

      next: () => {

        this.enviando = false;
        this.sucessoEnvio = true;

        this.nome = '';
        this.email = '';
        this.telefone = '';
        this.mensagem = '';

        form.resetForm();

      },

      error: (erro) => {

        console.error('Erro ao enviar solicitação:', erro);

        this.erroEnvio =
          'Não foi possível enviar sua solicitação. Tente novamente.';

        this.enviando = false;

      }

    });
  }

}