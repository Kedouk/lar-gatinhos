import { Component, inject } from '@angular/core';
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

  gatos: Gato[] = this.gatosService.getGatos();

}