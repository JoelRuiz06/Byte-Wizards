import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe, FormsModule],
  template: `
    <div class="section">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>Productos</h1>
            <p>{{ productosFiltrados().length }} productos encontrados</p>
          </div>
          <a routerLink="/productos/nuevo" class="btn btn-primary">+ Nuevo producto</a>
        </div>

        <div class="search-bar">
          <input type="text" [(ngModel)]="busqueda" (ngModelChange)="filtrar($event)"
                 placeholder="🔍 Buscar productos..." class="search-input" />
        </div>

        @if (cargando()) {
          <div class="loading">Cargando productos...</div>
        } @else if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        } @else if (productosFiltrados().length === 0) {
          <div class="empty-state">
            <div class="icon">📦</div>
            <h3>No hay productos</h3>
            <p>{{ busqueda ? 'No se encontraron resultados para "' + busqueda + '"' : 'Crea el primer producto' }}</p>
            @if (!busqueda) {
              <a routerLink="/productos/nuevo" class="btn btn-primary" style="margin-top:1rem">Crear producto</a>
            }
          </div>
        } @else {
          <div class="grid grid-4">
            @for (prod of productosFiltrados(); track prod.id) {
              <div class="card">
                <img [src]="prod.imagenUrl || 'https://picsum.photos/seed/' + prod.id + '/300/220'"
                     [alt]="prod.nombre" width="300" height="220"
                     loading="lazy" class="prod-img" />
                <div class="card-body">
                  <div class="prod-meta">
                    <span class="badge badge-primary">{{ prod.talla }}</span>
                    <span class="cat-name">{{ prod.categoria?.nombre }}</span>
                  </div>
                  <h3 class="prod-name">{{ prod.nombre }}</h3>
                  <p class="prod-desc">{{ prod.descripcion }}</p>
                  <div class="prod-footer">
                    <span class="precio">{{ prod.precio | currency:'EUR':'symbol':'1.2-2' }}</span>
                    <div style="display:flex;gap:.4rem">
                      <a [routerLink]="['/productos', prod.id]" class="btn btn-outline btn-sm">Ver</a>
                      <button (click)="eliminar(prod.id!)" class="btn btn-sm btn-del">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .search-bar { margin-bottom: 1.5rem; }
    .search-input { max-width: 400px; }
    .prod-img { width: 100%; height: 180px; object-fit: cover; }
    .prod-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: .4rem; }
    .cat-name { font-size: .75rem; color: var(--color-text-muted); font-weight: 500; }
    .prod-name { font-weight: 700; font-size: .95rem; margin-bottom: .2rem; }
    .prod-desc { color: var(--color-text-muted); font-size: .82rem;
                 white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: .5rem; }
    .prod-footer { display: flex; justify-content: space-between; align-items: center; }
    .btn-del { background: transparent; border: 1.5px solid var(--color-border);
               color: var(--color-text-muted); }
    .btn-del:hover { border-color: var(--color-error); color: var(--color-error); }
  `]
})
export class ProductoListComponent implements OnInit {
  private todosLosProductos = signal<Producto[]>([]);
  productosFiltrados = signal<Producto[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');
  busqueda = '';

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.productoService.listarTodos().subscribe({
      next: (prods) => {
        this.todosLosProductos.set(prods);
        this.productosFiltrados.set(prods);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar productos. ¿Está el backend en marcha?');
        this.cargando.set(false);
      }
    });
  }

  filtrar(texto: string): void {
    const q = texto.toLowerCase().trim();
    this.productosFiltrados.set(
      q ? this.todosLosProductos().filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.categoria?.nombre?.toLowerCase().includes(q) ||
        p.talla.toLowerCase().includes(q)
      ) : this.todosLosProductos()
    );
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este producto?')) return;
    this.productoService.eliminar(id).subscribe({
      next: () => {
        this.todosLosProductos.update(ps => ps.filter(p => p.id !== id));
        this.productosFiltrados.update(ps => ps.filter(p => p.id !== id));
      },
      error: () => this.error.set('No se pudo eliminar el producto.')
    });
  }
}
