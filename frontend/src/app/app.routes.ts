import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Adocao } from './pages/adocao/adocao';
import { Gato as GatoPage } from './pages/gato/gato';
import { Sobre } from './pages/sobre/sobre';
import { Ajude } from './pages/ajude/ajude';
import { Contato } from './pages/contato/contato';
import { Login } from './pages/login/login';
import { CadastroGato } from './pages/cadastro-gato/cadastro-gato';
import { SolicitacoesAdocao } from './pages/solicitacoes-adocao/solicitacoes-adocao';
import { GerenciamentoGatos } from './pages/gerenciamento-gatos/gerenciamento-gatos';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'adocao', component: Adocao },
  { path: 'gato/:id', component: GatoPage },
  { path: 'sobre', component: Sobre },
  { path: 'ajude', component: Ajude },
  { path: 'contato', component: Contato },
  { path: 'login', component: Login },

  {
    path: 'cadastro-gato',
    component: CadastroGato,
    canActivate: [adminGuard]
  },

  {
    path: 'editar-gato/:id',
    component: CadastroGato,
    canActivate: [adminGuard]
  },

  {
    path: 'solicitacoes-adocao',
    component: SolicitacoesAdocao,
    canActivate: [adminGuard]
  },

  {
    path: 'gerenciamento-gatos',
    component: GerenciamentoGatos,
    canActivate: [adminGuard]
  }
];