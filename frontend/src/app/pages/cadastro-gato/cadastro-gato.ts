
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

  processandoFoto = signal(false);

  erroCadastro = '';

  erroFoto = '';

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

  async selecionarFoto(event: Event): Promise<void> {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const arquivo = input.files[0];

    this.erroFoto = '';

    this.processandoFoto.set(true);

    const formatosPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!formatosPermitidos.includes(arquivo.type)) {

      this.erroFoto =
        'Formato inválido. Utilize JPG, PNG ou WEBP.';

      input.value = '';

      this.processandoFoto.set(false);

      return;

    }

    const tamanhoMaximoOriginal = 15 * 1024 * 1024;

    if (arquivo.size > tamanhoMaximoOriginal) {

      this.erroFoto =
        'A imagem original não pode ultrapassar 15 MB.';

      input.value = '';

      this.processandoFoto.set(false);

      return;

    }

    let imagem: ImageBitmap | null = null;

    try {

      imagem = await createImageBitmap(arquivo);

      const dimensaoMaxima = 1600;

      let largura = imagem.width;

      let altura = imagem.height;

      const proporcao = Math.min(
        1,
        dimensaoMaxima / largura,
        dimensaoMaxima / altura
      );

      largura = Math.round(largura * proporcao);

      altura = Math.round(altura * proporcao);

      let imagemComprimida: Blob | null = null;

      const tamanhoMaximoFinal = 2 * 1024 * 1024;

      for (let tentativa = 0; tentativa < 10; tentativa++) {

        const canvas = document.createElement('canvas');

        canvas.width = largura;

        canvas.height = altura;

        const contexto = canvas.getContext('2d');

        if (!contexto) {
          throw new Error(
            'Não foi possível processar a imagem.'
          );
        }

        contexto.drawImage(
          imagem,
          0,
          0,
          largura,
          altura
        );

        const qualidade = Math.max(
          0.35,
          0.82 - tentativa * 0.07
        );

        imagemComprimida = await new Promise<Blob | null>(
          resolve => {

            canvas.toBlob(
              resolve,
              'image/webp',
              qualidade
            );

          }
        );

        if (
          imagemComprimida &&
          imagemComprimida.type === 'image/webp' &&
          imagemComprimida.size <= tamanhoMaximoFinal
        ) {

          break;

        }

        imagemComprimida = null;

        largura = Math.max(
          1,
          Math.round(largura * 0.85)
        );

        altura = Math.max(
          1,
          Math.round(altura * 0.85)
        );

      }

      if (!imagemComprimida) {

        throw new Error(
          'Não foi possível reduzir a imagem para o limite de 2 MB. Tente outra fotografia.'
        );

      }

      const reader = new FileReader();

      const fotoBase64 = await new Promise<string>(
        (resolve, reject) => {

          reader.onload = () => {

            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(
                new Error('Não foi possível carregar a imagem.')
              );
            }

          };

          reader.onerror = () => {

            reject(
              new Error('Não foi possível carregar a imagem.')
            );

          };

          reader.readAsDataURL(imagemComprimida);

        }
      );

      this.foto = fotoBase64;

      this.fotoPreview = fotoBase64;

      this.nomeArquivo = `${arquivo.name} (otimizada)`;

    } catch (error) {

      console.error(
        'Erro ao otimizar fotografia:',
        error
      );

      this.erroFoto =
        error instanceof Error
          ? error.message
          : 'Não foi possível processar a imagem.';

      input.value = '';

    } finally {

      imagem?.close();

      this.processandoFoto.set(false);

    }

  }

  cadastrar(form: NgForm): void {

    this.erroCadastro = '';

    if (
      form.invalid ||
      this.processandoFoto() ||
      this.erroFoto ||
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

      personalidade: this.personalidade.trim(),

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
              '/gerenciamento-gatos'
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
            '/gerenciamento-gatos'
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
