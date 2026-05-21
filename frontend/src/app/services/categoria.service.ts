import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { Producto } from '../models/producto.model';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private readonly API = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API);
  }

  obtenerPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API}/${id}`);
  }

  crear(dto: Partial<Categoria>): Observable<Categoria> {
    return this.http.post<Categoria>(this.API, dto);
  }

  actualizar(id: number, dto: Partial<Categoria>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.API}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  obtenerProductos(id: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.API}/${id}/productos`);
  }
}
