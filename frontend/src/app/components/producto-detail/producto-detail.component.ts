import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe],
  template: `
    <div class="section">
      <div class="container detail-wrapper">
        <a routerLink="/productos" class="btn btn-outline btn-sm back-btn">← Volver</a>

        @if (cargando()) {
          <div class="loading">Cargando producto...</div>
        } @else if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        } @else if (producto()) {
          <div class="detail-card card">
            <img [src]="producto()!.imagenUrl || 'https://picsum.photos/seed/ropa/800/400'"
                 [alt]="producto()!.nombre" width="800" height="400"
                 loading="lazy" class="detail-img" />
            <div class="card-body">
              <div class="detail-meta">
                <span class="badge badge-primary">{{ producto()!.talla }}</span>
                <a [routerLink]="['/categorias', producto()!.categoria?.id]" class="cat-link">
                  {{ producto()!.categoria?.nombre }}
                </a>
              </div>
              <h1>{{ producto()!.nombre }}</h1>
              <p class="desc">{{ producto()!.descripcion }}</p>
              <div class="detail-info">
                <div class="info-item">
                  <span class="info-label">Precio</span>
                  <span class="precio">{{ producto()!.precio | currency:'EUR':'symbol':'1.2-2' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Talla</span>
                  <span>{{ producto()!.talla }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Stock</span>
                  <span [class.low]="producto()!.stock < 5">{{ producto()!.stock }} uds.</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Categoría</span>
                  <span>{{ producto()!.categoria?.nombre }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .back-btn { margin-bottom: 1.5rem; display: inline-flex; }
    .detail-wrapper { max-width: 760px; }
    .detail-img { width: 100%; height: 340px; object-fit: cover; }
    .detail-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: .75rem; }
    .cat-link { font-size: .85rem; color: var(--color-accent); font-weight: 600; text-decoration: none; }
    h1 { font-size: clamp(1.4rem,3vw,1.9rem); font-weight: 700; margin-bottom: .75rem; }
    .desc { color: var(--color-text-muted); margin-bottom: 1.5rem; }
    .detail-info { display: grid; grid-template-columns: repeat(2,1fr); gap: 1rem; }
    .info-item { display: flex; flex-direction: column; gap: .2rem; }
    .info-label { font-size: .78rem; text-transform: uppercase; letter-spacing: .05em;
                  color: var(--color-text-muted); font-weight: 600; }
    .low { color: var(--color-error); }
  `]
})
export class ProductoDetailComponent implements OnInit {
  producto = signal<Producto | null>(null);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  constructor(private route: ActivatedRoute, private productoService: ProductoService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productoService.obtenerPorId(id).subscribe({
      next: (prod) => { this.producto.set(prod); this.cargando.set(false); },
      error: () => { this.error.set('Producto no encontrado.'); this.cargando.set(false); }
    });
  }
}
