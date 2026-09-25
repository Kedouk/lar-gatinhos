import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../shared/header/header';
import { GatosService } from '../../services/gatos';

@Component({
  selector: 'app-cadastro-gato',
  imports: [FormsModule, Header],
  templateUrl: './cadastro-gato.html',
  styleUrl: './cadastro-gato.css',
})
export class CadastroGato {

  private gatosService = inject(GatosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  idGato: number | null = null;

  nome = '';
  idade = '';
  sexo = '';
  descricao = '';
  personalidade = '';
  foto = '';
  fotoPreview = '';
  nomeArquivo = '';

  castrado = false;
  vacinado = false;
  disponivel = true;

  fiv = '';
  felv = '';

  cadastrando = signal(false);
  carregando = signal(false);

  erroCadastro = '';
  erroCarregamento = signal('');

  constructor() {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      return;
    }

    this.idGato = id;
    this.carregarGato(id);
  }

  get modoEdicao(): boolean {
    return this.idGato !== null;
  }

  carregarGato(id: number): void {

    this.carregando.set(true);
    this.erroCarregamento.set('');

    this.gatosService.getGatoPorId(id).subscribe({

      next: (gato) => {

        this.nome = gato.nome;
        this.idade = gato.idade;
        this.sexo = gato.sexo;
        this.descricao = gato.descricao;
        this.personalidade = gato.personalidade;

        this.foto = gato.foto;
        this.fotoPreview = gato.foto;

        this.castrado = gato.castrado;
        this.vacinado = gato.vacinado;
        this.disponivel = gato.disponivel;

        this.fiv = gato.fiv;
        this.felv = gato.felv;

        this.carregando.set(false);
      },

      error: (erro) => {

        console.error(
          'Erro ao buscar gatinho:',
          erro
        );

        this.erroCarregamento.set(
          'Não foi possível carregar os dados do gatinho.'
        );

        this.carregando.set(false);
      }

    });
  }

  selecionarFoto(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const arquivo = input.files[0];

    this.nomeArquivo = arquivo.name;

    const reader = new FileReader();

    reader.onload = () => {

      this.fotoPreview =
        reader.result as string;

      this.foto =
        this.fotoPreview;
    };

    reader.readAsDataURL(arquivo);
  }

  cadastrar(form: NgForm): void {

    this.erroCadastro = '';

    if (
      form.invalid ||
      !this.nome.trim() ||
      !this.idade ||
      !this.sexo ||
      !this.foto
    ) {
      return;
    }

    this.cadastrando.set(true);

    const gato = {

      nome: this.nome.trim(),

      idade: this.idade,

      sexo: this.sexo,

      descricao: this.descricao.trim(),

      foto: this.foto,

      personalidade:
        this.personalidade.trim(),

      castrado: this.castrado,

      vacinado: this.vacinado,

      disponivel: this.disponivel,

      fiv: this.fiv,

      felv: this.felv

    };

    if (this.modoEdicao) {

      this.gatosService

        .atualizarGato(
          this.idGato!,
          gato
        )

        .subscribe({

          next: () => {

            this.router.navigate([
              '/adocao'
            ]);

          },

          error: (erro) => {

            console.error(
              'Erro ao atualizar gatinho:',
              erro
            );

            this.erroCadastro =
              'Não foi possível atualizar o gatinho. Tente novamente.';

            this.cadastrando.set(false);
          }

        });

      return;
    }

    this.gatosService

      .adicionarGato(gato)

      .subscribe({

        next: () => {

          this.router.navigate([
            '/adocao'
          ]);

        },

        error: (erro) => {

          console.error(
            'Erro ao cadastrar gatinho:',
            erro
          );

          this.erroCadastro =
            'Não foi possível cadastrar o gatinho. Tente novamente.';

          this.cadastrando.set(false);
        }

      });
  }

}