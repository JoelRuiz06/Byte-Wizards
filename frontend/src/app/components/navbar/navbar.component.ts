import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="container nav-inner">
        <a routerLink="/" class="brand">
          <span class="brand-icon">👗</span>
          <span>FashionStore</span>
        </a>
        <ul class="nav-links">
          <li>
            <a routerLink="/categorias" routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: false }">Categorías</a>
          </li>
          <li>
            <a routerLink="/productos" routerLinkActive="active"
               [routerLinkActiveOptions]="{ exact: false }">Productos</a>
          </li>
        </ul>
        <div class="nav-actions">
          <a routerLink="/categorias/nueva" class="btn btn-outline btn-sm">+ Categoría</a>
          <a routerLink="/productos/nuevo" class="btn btn-primary btn-sm">+ Producto</a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--color-primary);
      color: #fff;
      height: 64px;
      position: sticky; top: 0; z-index: 100;
      box-shadow: 0 2px 12px rgba(0,0,0,.2);
    }
    .nav-inner {
      display: flex; align-items: center;
      justify-content: space-between; height: 100%;
    }
    .brand {
      display: flex; align-items: center; gap: .5rem;
      font-weight: 700; font-size: 1.15rem;
      color: #fff; text-decoration: none;
    }
    .brand-icon { font-size: 1.4rem; }
    .nav-links {
      display: flex; list-style: none; gap: .25rem;
    }
    .nav-links a {
      color: rgba(255,255,255,.75); text-decoration: none;
      padding: .4rem .85rem; border-radius: 6px;
      font-size: .9rem; font-weight: 500;
      transition: background .2s, color .2s;
    }
    .nav-links a:hover, .nav-links a.active {
      background: rgba(255,255,255,.12); color: #fff;
    }
    .nav-actions { display: flex; gap: .6rem; }
    .nav-actions .btn-outline {
      border-color: rgba(255,255,255,.3); color: #fff;
    }
    .nav-actions .btn-outline:hover { background: rgba(255,255,255,.1); }
    @media (max-width: 600px) {
      .nav-actions { display: none; }
    }
  `]
})
export class NavbarComponent {}
