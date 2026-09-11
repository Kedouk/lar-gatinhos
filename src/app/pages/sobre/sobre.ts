import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-sobre',
  imports: [Header, RouterLink],
  templateUrl: './sobre.html',
  styleUrl: './sobre.css',
})
export class Sobre {

}