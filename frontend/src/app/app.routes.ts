import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/categorias', pathMatch: 'full' },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./components/categoria-list/categoria-list.component').then(m => m.CategoriaListComponent)
  },
  {
    path: 'categorias/nueva',
    loadComponent: () =>
      import('./components/categoria-form/categoria-form.component').then(m => m.CategoriaFormComponent)
  },
  {
    path: 'categorias/:id',
    loadComponent: () =>
      import('./components/categoria-detail/categoria-detail.component').then(m => m.CategoriaDetailComponent)
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./components/producto-list/producto-list.component').then(m => m.ProductoListComponent)
  },
  {
    path: 'productos/nuevo',
    loadComponent: () =>
      import('./components/producto-form/producto-form.component').then(m => m.ProductoFormComponent)
  },
  {
    path: 'productos/:id',
    loadComponent: () =>
      import('./components/producto-detail/producto-detail.component').then(m => m.ProductoDetailComponent)
  },
  { path: '**', redirectTo: '/categorias' }
];
