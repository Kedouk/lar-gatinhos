import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Adocao } from './pages/adocao/adocao';
import { Gato as GatoPage } from './pages/gato/gato';
import { Sobre } from './pages/sobre/sobre';
import { Ajude } from './pages/ajude/ajude';
import { Contato } from './pages/contato/contato';
import { CadastroGato } from './pages/cadastro-gato/cadastro-gato';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'adocao', component: Adocao },
  { path: 'gato/:id', component: GatoPage },
  { path: 'sobre', component: Sobre },
  { path: 'ajude', component: Ajude },
  { path: 'contato', component: Contato },
  { path: 'cadastro-gato', component: CadastroGato }
];