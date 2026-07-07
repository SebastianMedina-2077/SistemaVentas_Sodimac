import { Routes } from '@angular/router';
import { sesionGuard } from './nucleo/sesion.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  {
    path: 'login',
    title: 'Iniciar sesión · Sistema de Ventas Sodimac',
    loadComponent: () => import('./paginas/login/login').then((m) => m.Login),
  },

  // --- Canal digital: tienda online (CUS-02 / CUS-03) ---
  {
    path: 'tienda',
    canActivate: [sesionGuard],
    loadComponent: () => import('./paginas/tienda/tienda-layout').then((m) => m.TiendaLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'catalogo' },
      {
        path: 'catalogo',
        title: 'Catálogo · Tienda Sodimac',
        loadComponent: () => import('./paginas/tienda/catalogo').then((m) => m.Catalogo),
      },
      {
        path: 'checkout',
        title: 'Finalizar compra · Tienda Sodimac',
        loadComponent: () => import('./paginas/tienda/checkout').then((m) => m.Checkout),
      },
    ],
  },

  // --- Panel administrativo (CUS-01 / 04 / 05 / 06) ---
  {
    path: 'admin',
    canActivate: [sesionGuard],
    loadComponent: () => import('./paginas/admin/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', title: 'Dashboard · Sodimac', loadComponent: () => import('./paginas/admin/dashboard').then((m) => m.Dashboard) },
      { path: 'pos', title: 'Punto de Venta · Sodimac', loadComponent: () => import('./paginas/admin/pos').then((m) => m.Pos) },
      { path: 'inventario', title: 'Inventario · Sodimac', loadComponent: () => import('./paginas/admin/inventario').then((m) => m.Inventario) },
      { path: 'reportes', title: 'Reportes · Sodimac', loadComponent: () => import('./paginas/admin/reportes').then((m) => m.Reportes) },
      { path: 'devoluciones', title: 'Devoluciones · Sodimac', loadComponent: () => import('./paginas/admin/devoluciones').then((m) => m.Devoluciones) },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
