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

const TITULOS: Record<string, string> = {
  dashboard: 'Dashboard General',
  pos: 'Punto de Venta — CUS-01',
  inventario: 'Gestión de Inventario — CUS-05',
  reportes: 'Reportes de Ventas — CUS-06',
  devoluciones: 'Devoluciones y Cambios — CUS-04',
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

  readonly items: ItemNav[] = [
    { ruta: 'dashboard', nombre: 'Dashboard', icono: 'bi-grid-1x2' },
    { ruta: 'pos', nombre: 'Punto de Venta', icono: 'bi-upc-scan' },
    { ruta: 'inventario', nombre: 'Inventario', icono: 'bi-box-seam' },
    { ruta: 'reportes', nombre: 'Reportes', icono: 'bi-bar-chart' },
    { ruta: 'devoluciones', nombre: 'Devoluciones', icono: 'bi-arrow-return-left' },
  ];

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
