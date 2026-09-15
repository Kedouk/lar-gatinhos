import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  private authService = inject(AuthService);
  private router = inject(Router);

  get estaLogado(): boolean {
    return this.authService.estaAutenticado();
  }

  sair(): void {

    this.authService.logout();

    this.router.navigate(['/']);

  }

}