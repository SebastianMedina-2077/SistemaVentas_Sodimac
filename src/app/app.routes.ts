import { Routes } from '@angular/router';
import { moduloGuard } from './nucleo/modulo.guard';
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
      { path: 'dashboard', canActivate: [moduloGuard], title: 'Dashboard · Sodimac', loadComponent: () => import('./paginas/admin/dashboard').then((m) => m.Dashboard) },
      { path: 'pos', canActivate: [moduloGuard], title: 'Punto de Venta · Sodimac', loadComponent: () => import('./paginas/admin/pos').then((m) => m.Pos) },
      { path: 'cotizaciones', canActivate: [moduloGuard], title: 'Cotizaciones · Sodimac', loadComponent: () => import('./paginas/admin/cotizaciones').then((m) => m.Cotizaciones) },
      { path: 'reservas', canActivate: [moduloGuard], title: 'Reservas Click & Collect · Sodimac', loadComponent: () => import('./paginas/admin/reservas').then((m) => m.Reservas) },
      { path: 'devoluciones', canActivate: [moduloGuard], title: 'Devoluciones · Sodimac', loadComponent: () => import('./paginas/admin/devoluciones').then((m) => m.Devoluciones) },
      { path: 'cierre', canActivate: [moduloGuard], title: 'Cierre de caja · Sodimac', loadComponent: () => import('./paginas/admin/cierre').then((m) => m.Cierre) },
      { path: 'consulta', canActivate: [moduloGuard], title: 'Consulta de productos · Sodimac', loadComponent: () => import('./paginas/admin/consulta').then((m) => m.Consulta) },
      { path: 'inventario', canActivate: [moduloGuard], title: 'Inventario · Sodimac', loadComponent: () => import('./paginas/admin/inventario').then((m) => m.Inventario) },
      { path: 'reposicion', canActivate: [moduloGuard], title: 'Reposición · Sodimac', loadComponent: () => import('./paginas/admin/reposicion').then((m) => m.Reposicion) },
      { path: 'recepcion', canActivate: [moduloGuard], title: 'Recepción de mercadería · Sodimac', loadComponent: () => import('./paginas/admin/recepcion').then((m) => m.Recepcion) },
      { path: 'productos', canActivate: [moduloGuard], title: 'Gestión de productos · Sodimac', loadComponent: () => import('./paginas/admin/productos').then((m) => m.Productos) },
      { path: 'reportes', canActivate: [moduloGuard], title: 'Reportes · Sodimac', loadComponent: () => import('./paginas/admin/reportes').then((m) => m.Reportes) },
      { path: 'clientes', canActivate: [moduloGuard], title: 'Clientes · Sodimac', loadComponent: () => import('./paginas/admin/clientes').then((m) => m.Clientes) },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
