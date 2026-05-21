export interface Categoria {
  id?: number;
  nombre: string;
  descripcion?: string;
  productos?: Producto[];
}

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
