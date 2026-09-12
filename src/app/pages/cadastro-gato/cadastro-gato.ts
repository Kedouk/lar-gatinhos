import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../../shared/header/header';
import { GatosService } from '../../services/gatos';

@Component({
  selector: 'app-cadastro-gato',
  imports: [Header, FormsModule],
  templateUrl: './cadastro-gato.html',
  styleUrl: './cadastro-gato.css',
})
export class CadastroGato {

  private gatosService = inject(GatosService);
  private router = inject(Router);

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

  selecionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const arquivo = input.files[0];

    this.nomeArquivo = arquivo.name;

    const reader = new FileReader();

    reader.onload = () => {
      this.fotoPreview = reader.result as string;
      this.foto = this.fotoPreview;
    };

    reader.readAsDataURL(arquivo);
  }

  cadastrar(form: NgForm): void {

    if (
      form.invalid ||
      !this.nome.trim() ||
      !this.idade ||
      !this.sexo ||
      !this.foto
    ) {
      return;
    }

    this.gatosService.adicionarGato({
      nome: this.nome.trim(),
      idade: this.idade,
      sexo: this.sexo,
      descricao: this.descricao.trim(),
      foto: this.foto,
      personalidade: this.personalidade.trim(),
      castrado: this.castrado,
      vacinado: this.vacinado,
      disponivel: this.disponivel
    });

    this.router.navigate(['/adocao']);
  }

}