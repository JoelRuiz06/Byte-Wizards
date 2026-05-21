import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="section">
      <div class="container form-wrapper">
        <div class="page-header">
          <div>
            <h1>Nuevo Producto</h1>
            <p>Añade un producto a la tienda</p>
          </div>
          <a routerLink="/productos" class="btn btn-outline btn-sm">← Volver</a>
        </div>

        @if (exito()) { <div class="alert alert-success">✓ Producto creado. Redirigiendo...</div> }
        @if (errorMsg()) { <div class="alert alert-error">{{ errorMsg() }}</div> }

        <div class="card">
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">

              <div class="form-group">
                <label for="nombre">Nombre *</label>
                <input id="nombre" type="text" formControlName="nombre"
                       [class.invalid]="isInvalid('nombre')"
                       placeholder="Ej: Camiseta básica blanca" />
                @if (isInvalid('nombre')) {
                  <span class="error-msg">
                    @if (form.get('nombre')?.errors?.['required']) { El nombre es obligatorio. }
                    @else { Mínimo 2 caracteres. }
                  </span>
                }
              </div>

              <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" formControlName="descripcion" rows="3"
                          placeholder="Descripción del producto..."></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="precio">Precio (€) *</label>
                  <input id="precio" type="number" formControlName="precio"
                         step="0.01" min="0.01"
                         [class.invalid]="isInvalid('precio')" placeholder="0.00" />
                  @if (isInvalid('precio')) {
                    <span class="error-msg">Precio obligatorio y mayor que 0.</span>
                  }
                </div>
                <div class="form-group">
                  <label for="talla">Talla *</label>
                  <select id="talla" formControlName="talla" [class.invalid]="isInvalid('talla')">
                    <option value="">Selecciona talla</option>
                    @for (t of tallas; track t) {
                      <option [value]="t">{{ t }}</option>
                    }
                  </select>
                  @if (isInvalid('talla')) {
                    <span class="error-msg">La talla es obligatoria.</span>
                  }
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="stock">Stock *</label>
                  <input id="stock" type="number" formControlName="stock"
                         min="0" [class.invalid]="isInvalid('stock')" placeholder="0" />
                  @if (isInvalid('stock')) {
                    <span class="error-msg">Stock obligatorio, mínimo 0.</span>
                  }
                </div>
                <div class="form-group">
                  <label for="categoriaId">Categoría *</label>
                  <select id="categoriaId" formControlName="categoriaId"
                          [class.invalid]="isInvalid('categoriaId')">
                    <option value="">Selecciona categoría</option>
                    @for (cat of categorias(); track cat.id) {
                      <option [value]="cat.id">{{ cat.nombre }}</option>
                    }
                  </select>
                  @if (isInvalid('categoriaId')) {
                    <span class="error-msg">La categoría es obligatoria.</span>
                  }
                </div>
              </div>

              <div class="form-group">
                <label for="imagenUrl">URL de imagen</label>
                <input id="imagenUrl" type="url" formControlName="imagenUrl"
                       placeholder="https://ejemplo.com/imagen.jpg" />
              </div>

              <div class="form-actions">
                <a routerLink="/productos" class="btn btn-outline">Cancelar</a>
                <button type="submit" class="btn btn-primary"
                        [disabled]="form.invalid || enviando()">
                  {{ enviando() ? 'Guardando...' : 'Crear producto' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-wrapper { max-width: 700px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
    textarea { resize: vertical; }
    @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
  `]
})
export class ProductoFormComponent implements OnInit {
  form: FormGroup;
  categorias = signal<Categoria[]>([]);
  enviando = signal<boolean>(false);
  exito = signal<boolean>(false);
  errorMsg = signal<string>('');
  tallas = ['XS','S','M','L','XL','XXL','36','38','40','42','44','Única'];

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre:      ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', Validators.maxLength(255)],
      precio:      [null, [Validators.required, Validators.min(0.01)]],
      talla:       ['', Validators.required],
      stock:       [null, [Validators.required, Validators.min(0)]],
      imagenUrl:   [''],
      categoriaId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoriaService.listarTodas().subscribe({
      next: (cats) => this.categorias.set(cats),
      error: () => this.errorMsg.set('No se pudieron cargar las categorías.')
    });
  }

  isInvalid(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.enviando.set(true);
    this.errorMsg.set('');
    const dto = { ...this.form.value, categoriaId: Number(this.form.value.categoriaId) };
    this.productoService.crear(dto).subscribe({
      next: () => {
        this.exito.set(true);
        this.enviando.set(false);
        setTimeout(() => this.router.navigate(['/productos']), 1500);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.error || 'Error al crear el producto.');
        this.enviando.set(false);
      }
    });
  }
}
