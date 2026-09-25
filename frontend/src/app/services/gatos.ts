import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Gato {
  id: number;
  nome: string;
  idade: string;
  sexo: string;
  descricao: string;
  foto: string;
  personalidade: string;
  castrado: boolean;
  vacinado: boolean;
  disponivel: boolean;
  fiv: string;
  felv: string;
}

@Injectable({
  providedIn: 'root'
})
export class GatosService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/gatos';

  private prepararFoto(foto: string): string {

    if (
      foto.startsWith('http') ||
      foto.startsWith('data:') ||
      foto.startsWith('/')
    ) {

      return foto;

    }

    return `/${foto}`;
  }

  private prepararGatos(gatos: Gato[]): Gato[] {

    return gatos.map(gato => ({

      ...gato,

      foto: this.prepararFoto(gato.foto)

    }));
  }

  getGatos(): Observable<Gato[]> {

    return this.http.get<Gato[]>(this.apiUrl).pipe(

      map(gatos => this.prepararGatos(gatos))

    );
  }

  getGatosDisponiveis(): Observable<Gato[]> {

    return this.getGatos().pipe(

      map(gatos => gatos.filter(gato => gato.disponivel))

    );
  }

  getGatoPorId(id: number): Observable<Gato> {

    return this.http.get<Gato>(

      `${this.apiUrl}/${id}`

    );
  }

  adicionarGato(
    gato: Omit<Gato, 'id'>
  ): Observable<Gato> {

    return this.http.post<Gato>(

      this.apiUrl,

      gato

    ).pipe(

      map(gatoCadastrado => ({

        ...gatoCadastrado,

        foto: this.prepararFoto(gatoCadastrado.foto)

      }))

    );
  }

  atualizarGato(
    id: number,
    gato: Omit<Gato, 'id'>
  ): Observable<Gato> {

    return this.http.put<Gato>(

      `${this.apiUrl}/${id}`,

      gato

    ).pipe(

      map(gatoAtualizado => ({

        ...gatoAtualizado,

        foto: this.prepararFoto(gatoAtualizado.foto)

      }))

    );
  }

  excluirGato(id: number): Observable<void> {

    return this.http.delete<void>(

      `${this.apiUrl}/${id}`

    );
  }

}