import { Component, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-categoria-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe],
  template: `
    <div class="section">
      <div class="container">
        <a routerLink="/categorias" class="btn btn-outline btn-sm back-btn">← Volver a categorías</a>

        @if (cargando()) {
          <div class="loading">Cargando...</div>
        } @else if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        } @else {
          <div class="page-header">
            <div>
              <h1>{{ categoria()?.nombre }}</h1>
              <p>{{ categoria()?.descripcion }}</p>
            </div>
            <div style="display:flex;gap:.6rem;">
              <a routerLink="/productos/nuevo" class="btn btn-primary">+ Nuevo producto</a>
            </div>
          </div>

          <div class="stats-bar">
            <span class="badge badge-primary">{{ totalProductos() }} productos</span>
            @if (totalProductos() > 0) {
              <span class="badge badge-gray">Stock total: {{ stockTotal() }} uds.</span>
            }
          </div>

          @if (productos().length === 0) {
            <div class="empty-state">
              <div class="icon">📦</div>
              <h3>Sin productos en esta categoría</h3>
              <a routerLink="/productos/nuevo" class="btn btn-primary" style="margin-top:1rem">Añadir producto</a>
            </div>
          } @else {
            <div class="grid grid-4" style="margin-top:1.5rem">
              @for (prod of productos(); track prod.id) {
                <div class="card">
                  <img [src]="prod.imagenUrl || 'https://picsum.photos/seed/' + prod.id + '/300/200'"
                       [alt]="prod.nombre" width="300" height="200"
                       loading="lazy" class="prod-img" />
                  <div class="card-body">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
                      <span class="badge badge-primary">{{ prod.talla }}</span>
                      <span [class]="prod.stock < 5 ? 'badge badge-gray low' : 'badge badge-success'">
                        {{ prod.stock }} uds.
                      </span>
                    </div>
                    <h3 class="prod-name">{{ prod.nombre }}</h3>
                    <p class="prod-desc">{{ prod.descripcion }}</p>
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.75rem">
                      <span class="precio">{{ prod.precio | currency:'EUR':'symbol':'1.2-2' }}</span>
                      <a [routerLink]="['/productos', prod.id]" class="btn btn-outline btn-sm">Ver</a>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .back-btn { margin-bottom: 1.5rem; display: inline-flex; }
    .stats-bar { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .5rem; }
    .prod-img { width: 100%; height: 160px; object-fit: cover; }
    .prod-name { font-weight: 700; font-size: .95rem; margin-bottom: .25rem; }
    .prod-desc { color: var(--color-text-muted); font-size: .82rem;
                 white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .low { color: var(--color-error) !important; }
  `]
})
export class CategoriaDetailComponent implements OnInit {
  categoria = signal<Categoria | null>(null);
  productos = signal<Producto[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  totalProductos = computed(() => this.productos().length);
  stockTotal = computed(() => this.productos().reduce((sum, p) => sum + p.stock, 0));

  constructor(private route: ActivatedRoute, private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.categoriaService.obtenerPorId(id).subscribe({
      next: (cat) => {
        this.categoria.set(cat);
        this.categoriaService.obtenerProductos(id).subscribe({
          next: (prods) => { this.productos.set(prods); this.cargando.set(false); },
          error: () => { this.cargando.set(false); }
        });
      },
      error: () => { this.error.set('Categoría no encontrada.'); this.cargando.set(false); }
    });
  }
}
