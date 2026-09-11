import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Adocao } from './pages/adocao/adocao';
import { Gato } from './pages/gato/gato';

export const routes: Routes = [
  {
    path: '',
    component: Home
  },
  {
    path: 'adocao',
    component: Adocao
  },
  {
    path: 'gato/:id',
    component: Gato
  }
];