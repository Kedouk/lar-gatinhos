import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Administrador {
  id: number;
  nome: string;
  email: string;
}

export interface LoginResposta {
  token: string;
  administrador: Administrador;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000';

  login(
    email: string,
    senha: string
  ): Observable<LoginResposta> {

    return this.http.post<LoginResposta>(
      `${this.apiUrl}/login`,
      {
        email,
        senha
      }
    ).pipe(
      tap(resposta => {
        localStorage.setItem(
          'token',
          resposta.token
        );

        localStorage.setItem(
          'administrador',
          JSON.stringify(resposta.administrador)
        );
      })
    );

  }

  estaAutenticado(): boolean {

    return !!localStorage.getItem('token');

  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('administrador');

  }

}