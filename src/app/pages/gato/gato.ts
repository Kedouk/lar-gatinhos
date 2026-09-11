import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Gato as GatoModel, gatos } from '../../services/gatos';

@Component({
  selector: 'app-gato',
  imports: [Header, RouterLink],
  templateUrl: './gato.html',
  styleUrl: './gato.css',
})
export class Gato {

  private route = inject(ActivatedRoute);

  gato: GatoModel | undefined;

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.gato = gatos.find(gato => gato.id === id);
  }

}