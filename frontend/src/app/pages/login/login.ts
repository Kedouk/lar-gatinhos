import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  senha = '';

  entrando = false;
  erroLogin = '';

  entrar(form: NgForm): void {

    this.erroLogin = '';

    if (form.invalid) {
      return;
    }

    this.entrando = true;

    this.authService
      .login(
        this.email.trim(),
        this.senha
      )
      .subscribe({

        next: () => {

          this.entrando = false;

          this.router.navigate(['/gerenciamento-gatos']);

        },

        error: (erro) => {

          console.error('Erro ao realizar login:', erro);

          this.erroLogin =
            erro.error?.message ||
            'Não foi possível realizar o login. Tente novamente.';

          this.entrando = false;

        }

      });

  }

}