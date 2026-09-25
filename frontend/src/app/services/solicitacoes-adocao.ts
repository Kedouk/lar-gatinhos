import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

export interface SolicitacaoAdocao {

  id?: number;

  gato_id: number | null;

  gato_nome?: string;

  nome: string;

  email: string;

  telefone: string;

  cidade: string;

  idade: number;

  tipo_moradia: string;

  tipo_imovel: string;

  casa_telada: boolean;

  moradia_segura: boolean;

  quantidade_moradores: number;

  todos_de_acordo: boolean;

  possui_outros_animais: boolean;

  compromisso_longo_prazo: boolean;

  respeita_tempo_adaptacao: boolean;

  motivo_adocao: string;

  sobre_adotante: string;

  mensagem?: string;

  status?: string;

  criada_em?: string;

}

@Injectable({
  providedIn: 'root'
})
export class SolicitacoesAdocaoService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/solicitacoes-adocao';

  enviarSolicitacao(
    solicitacao: SolicitacaoAdocao
  ): Observable<SolicitacaoAdocao> {

    return this.http.post<SolicitacaoAdocao>(
      this.apiUrl,
      solicitacao
    );

  }

  getSolicitacoes(): Observable<SolicitacaoAdocao[]> {

    return this.http.get<SolicitacaoAdocao[]>(
      this.apiUrl
    );

  }

  atualizarStatus(
    id: number,
    status: string
  ): Observable<SolicitacaoAdocao> {

    return this.http.patch<SolicitacaoAdocao>(
      `${this.apiUrl}/${id}/status`,
      { status }
    );

  }

  excluirSolicitacao(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );

  }

}