import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="section">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>Categorías</h1>
            <p>{{ categorias().length }} categorías disponibles</p>
          </div>
          <a routerLink="/categorias/nueva" class="btn btn-primary">+ Nueva categoría</a>
        </div>

        @if (cargando()) {
          <div class="loading">Cargando categorías...</div>
        } @else if (error()) {
          <div class="alert alert-error">{{ error() }}</div>
        } @else if (categorias().length === 0) {
          <div class="empty-state">
            <div class="icon">🗂️</div>
            <h3>No hay categorías todavía</h3>
            <p>Crea la primera categoría para empezar</p>
            <a routerLink="/categorias/nueva" class="btn btn-primary" style="margin-top:1rem">Crear categoría</a>
          </div>
        } @else {
          <div class="grid grid-3">
            @for (cat of categorias(); track cat.id) {
              <div class="card cat-card">
                <div class="cat-cover" [style.background]="getColor(cat.nombre)">
                  <span class="cat-emoji">{{ getEmoji(cat.nombre) }}</span>
                </div>
                <div class="card-body">
                  <h2>{{ cat.nombre }}</h2>
                  <p class="desc">{{ cat.descripcion || 'Sin descripción' }}</p>
                  <div class="cat-actions">
                    <a [routerLink]="['/categorias', cat.id]" class="btn btn-primary btn-sm">Ver productos</a>
                    <button (click)="eliminar(cat.id!)" class="btn btn-outline btn-sm btn-del">Eliminar</button>
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
    .cat-cover {
      height: 100px; display: flex;
      align-items: center; justify-content: center;
    }
    .cat-emoji { font-size: 2.8rem; }
    h2 { font-size: 1.1rem; font-weight: 700; margin-bottom: .35rem; }
    .desc { color: var(--color-text-muted); font-size: .88rem; margin-bottom: 1rem;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cat-actions { display: flex; gap: .5rem; }
    .btn-del:hover { border-color: var(--color-error); color: var(--color-error); }
  `]
})
export class CategoriaListComponent implements OnInit {
  categorias = signal<Categoria[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  private paleta = ['#fce7ec','#e0f2fe','#fef9c3','#dcfce7','#ede9fe','#ffedd5'];
  private emojis: Record<string, string> = {
    camisetas: '👕', pantalones: '👖', sudaderas: '🧥',
    accesorios: '🎒', zapatos: '👟', vestidos: '👗', default: '🛍️'
  };

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (cats) => { this.categorias.set(cats); this.cargando.set(false); },
      error: () => { this.error.set('Error al cargar categorías. ¿Está el backend en marcha?'); this.cargando.set(false); }
    });
  }

  getColor(nombre: string): string {
    const idx = nombre.charCodeAt(0) % this.paleta.length;
    return this.paleta[idx];
  }

  getEmoji(nombre: string): string {
    const key = nombre.toLowerCase();
    return this.emojis[key] ?? this.emojis['default'];
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta categoría y todos sus productos?')) return;
    this.categoriaService.eliminar(id).subscribe({
      next: () => this.categorias.update(cats => cats.filter(c => c.id !== id)),
      error: () => this.error.set('No se pudo eliminar la categoría.')
    });
  }
}
