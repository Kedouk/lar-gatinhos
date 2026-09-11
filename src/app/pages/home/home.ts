import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Header } from '../../shared/header/header';

@Component({
  selector: 'app-home',
  imports: [Header, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}