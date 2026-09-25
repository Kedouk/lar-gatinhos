import { Routes } from '@angular/router';

import { Home } from './pages/home/home';

import { Adocao } from './pages/adocao/adocao';

import { Ajude } from './pages/ajude/ajude';

import { CadastroGato } from './pages/cadastro-gato/cadastro-gato';

import { Contato } from './pages/contato/contato';

import { FormularioAdocao } from './pages/formulario-adocao/formulario-adocao';

import { Gato } from './pages/gato/gato';

import { GerenciamentoGatos } from './pages/gerenciamento-gatos/gerenciamento-gatos';

import { Login } from './pages/login/login';

import { Sobre } from './pages/sobre/sobre';

import { SolicitacoesAdocao } from './pages/solicitacoes-adocao/solicitacoes-adocao';

import { adminGuard } from './guards/admin-guard';


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
    path: 'ajude',
    component: Ajude
  },

  {
    path: 'cadastro-gato',
    component: CadastroGato,
    canActivate: [adminGuard]
  },

  {
    path: 'cadastro-gato/:id',
    component: CadastroGato,
    canActivate: [adminGuard]
  },

  {
    path: 'contato',
    component: Contato
  },

  {
    path: 'formulario-adocao',
    component: FormularioAdocao
  },

  {
    path: 'gato/:id',
    component: Gato
  },

  {
    path: 'gerenciamento-gatos',
    component: GerenciamentoGatos,
    canActivate: [adminGuard]
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'sobre',
    component: Sobre
  },

  {
    path: 'solicitacoes-adocao',
    component: SolicitacoesAdocao,
    canActivate: [adminGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }

];