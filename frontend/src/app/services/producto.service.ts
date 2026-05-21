import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly API = 'http://localhost:8080/api/productos';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.API);
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.API}/${id}`);
  }

  crear(dto: Partial<Producto>): Observable<Producto> {
    return this.http.post<Producto>(this.API, dto);
  }

  actualizar(id: number, dto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.API}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
