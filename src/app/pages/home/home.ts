import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Gato, GatosService } from '../../services/gatos';

@Component({
  selector: 'app-home',
  imports: [Header, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private gatosService = inject(GatosService);

  gatos = signal<Gato[]>([]);

  constructor() {

    this.gatosService.getGatosDisponiveis().subscribe({

      next: (gatos) => {
        this.gatos.set(gatos);
      },

      error: (erro) => {
        console.error('Erro ao buscar gatinhos:', erro);
      }

    });
  }

}