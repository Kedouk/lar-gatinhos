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

  gato = signal<Gato | undefined>(undefined);

  nome = '';
  email = '';
  telefone = '';
  mensagem = '';

  enviando = false;
  erroEnvio = '';
  sucessoEnvio = false;

  constructor() {

    const id = Number(this.route.snapshot.queryParamMap.get('gato'));

    if (!id) {
      return;
    }

    this.gatosService.getGatoPorId(id).subscribe({

      next: (gato) => {
        this.gato.set(gato);
      },

      error: (erro) => {
        console.error('Erro ao buscar gatinho:', erro);
      }

    });
  }

  enviar(form: NgForm): void {

    this.erroEnvio = '';
    this.sucessoEnvio = false;

    if (form.invalid || !this.gato()) {
      return;
    }

    this.enviando = true;

    this.solicitacoesService.enviarSolicitacao({

      gato_id: this.gato()!.id,
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