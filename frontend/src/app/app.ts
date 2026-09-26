import { Component, inject, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { Footer } from './shared/footer/footer';

import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet,
    Footer
  ],

  templateUrl: './app.html',

  styleUrl: './app.css'
})
export class App {

  private authService = inject(AuthService);

  protected readonly title = signal('frontend');

  estaAutenticado(): boolean {
    return this.authService.estaAutenticado();
  }

}