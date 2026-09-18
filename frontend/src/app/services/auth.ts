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

interface TokenPayload {
  exp?: number;
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

    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }

    try {

      const partes = token.split('.');

      if (partes.length !== 3) {
        this.logout();
        return false;
      }

      const payload: TokenPayload = JSON.parse(
        atob(partes[1].replace(/-/g, '+').replace(/_/g, '/'))
      );

      if (
        payload.exp &&
        payload.exp * 1000 <= Date.now()
      ) {

        this.logout();
        return false;

      }

      return true;

    } catch {

      this.logout();
      return false;

    }

  }

  logout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('administrador');

  }

}