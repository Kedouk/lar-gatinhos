import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Gato as GatoModel, GatosService } from '../../services/gatos';

@Component({
  selector: 'app-gato',
  imports: [Header, RouterLink],
  templateUrl: './gato.html',
  styleUrl: './gato.css',
})
export class Gato {

  private route = inject(ActivatedRoute);
  private gatosService = inject(GatosService);

  gato = signal<GatoModel | undefined>(undefined);
  carregando = signal(true);
  erro = signal(false);

  constructor() {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.gatosService.getGatoPorId(id).subscribe({

      next: (gato) => {

        const foto =
          gato.foto.startsWith('http') ||
          gato.foto.startsWith('data:') ||
          gato.foto.startsWith('/')
            ? gato.foto
            : `/${gato.foto}`;

        this.gato.set({
          ...gato,
          foto
        });

        this.carregando.set(false);

      },

      error: (erro) => {

        console.error('Erro ao buscar gatinho:', erro);

        this.erro.set(true);
        this.carregando.set(false);

      }

    });
  }

}