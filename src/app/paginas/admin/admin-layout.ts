import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { CarritoService } from '../../nucleo/carrito.service';
import { SesionService } from '../../nucleo/sesion.service';

interface ItemNav {
  ruta: string;
  nombre: string;
  icono: string;
}

// Referencia de casos de uso: pos=CUS-01, devoluciones=CUS-04,
// inventario=CUS-05, reportes=CUS-06.
const TITULOS: Record<string, string> = {
  dashboard: 'Dashboard general',
  pos: 'Punto de venta',
  inventario: 'Gestión de inventario',
  reportes: 'Reportes de ventas',
  devoluciones: 'Devoluciones y cambios',
  consulta: 'Consulta de productos',
};

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  private readonly sesion = inject(SesionService);
  private readonly carrito = inject(CarritoService);
  private readonly router = inject(Router);

  readonly nombreRol = this.sesion.nombreRol;
  readonly iniciales = this.sesion.iniciales;

  /** Todos los módulos del panel, en orden lógico. */
  private readonly todos: ItemNav[] = [
    { ruta: 'dashboard', nombre: 'Dashboard', icono: 'bi-grid-1x2' },
    { ruta: 'pos', nombre: 'Punto de venta', icono: 'bi-upc-scan' },
    { ruta: 'consulta', nombre: 'Consulta de productos', icono: 'bi-search' },
    { ruta: 'inventario', nombre: 'Inventario', icono: 'bi-box-seam' },
    { ruta: 'reportes', nombre: 'Reportes', icono: 'bi-bar-chart' },
    { ruta: 'devoluciones', nombre: 'Devoluciones', icono: 'bi-arrow-return-left' },
  ];

  /** Solo los módulos permitidos para el rol activo. */
  readonly items = computed(() => {
    const permitidos = this.sesion.rol()?.modulos ?? [];
    return this.todos.filter((it) => permitidos.includes(it.ruta as never));
  });

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly titulo = computed(() => {
    const seg = this.url().split('/').filter(Boolean).pop() ?? 'dashboard';
    return TITULOS[seg] ?? 'Panel administrativo';
  });

  salir(): void {
    this.sesion.cerrar();
    this.carrito.limpiar('pos');
    this.router.navigate(['/login']);
  }
}
