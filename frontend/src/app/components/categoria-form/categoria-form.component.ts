import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="section">
      <div class="container form-wrapper">
        <div class="page-header">
          <div>
            <h1>Nueva Categoría</h1>
            <p>Añade una nueva categoría de ropa</p>
          </div>
          <a routerLink="/categorias" class="btn btn-outline btn-sm">← Volver</a>
        </div>

        @if (exito()) { <div class="alert alert-success">✓ Categoría creada. Redirigiendo...</div> }
        @if (errorMsg()) { <div class="alert alert-error">{{ errorMsg() }}</div> }

        <div class="card">
          <div class="card-body">
            <form [formGroup]="form" (ngSubmit)="onSubmit()">

              <div class="form-group">
                <label for="nombre">Nombre *</label>
                <input id="nombre" type="text" formControlName="nombre"
                       [class.invalid]="isInvalid('nombre')"
                       placeholder="Ej: Camisetas, Pantalones, Sudaderas..." />
                @if (isInvalid('nombre')) {
                  <span class="error-msg">
                    @if (form.get('nombre')?.errors?.['required']) { El nombre es obligatorio. }
                    @else if (form.get('nombre')?.errors?.['minlength']) { Mínimo 2 caracteres. }
                    @else { Máximo 100 caracteres. }
                  </span>
                }
              </div>

              <div class="form-group">
                <label for="descripcion">Descripción</label>
                <textarea id="descripcion" formControlName="descripcion" rows="4"
                          placeholder="Describe brevemente esta categoría..."></textarea>
                @if (isInvalid('descripcion')) {
                  <span class="error-msg">Máximo 255 caracteres.</span>
                }
              </div>

              <div class="form-actions">
                <a routerLink="/categorias" class="btn btn-outline">Cancelar</a>
                <button type="submit" class="btn btn-primary" [disabled]="form.invalid || enviando()">
                  {{ enviando() ? 'Guardando...' : 'Crear categoría' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-wrapper { max-width: 600px; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
    textarea { resize: vertical; }
  `]
})
export class CategoriaFormComponent {
  form: FormGroup;
  enviando = signal<boolean>(false);
  exito = signal<boolean>(false);
  errorMsg = signal<string>('');

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      descripcion: ['', Validators.maxLength(255)]
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
    this.categoriaService.crear(this.form.value).subscribe({
      next: () => {
        this.exito.set(true);
        this.enviando.set(false);
        setTimeout(() => this.router.navigate(['/categorias']), 1500);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.error || 'Error al crear la categoría.');
        this.enviando.set(false);
      }
    });
  }
}
