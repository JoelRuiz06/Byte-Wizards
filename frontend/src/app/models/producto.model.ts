import { Categoria } from './categoria.model';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  talla: string;
  stock: number;
  imagenUrl?: string;
  categoria?: Categoria;
  categoriaId?: number;
}
