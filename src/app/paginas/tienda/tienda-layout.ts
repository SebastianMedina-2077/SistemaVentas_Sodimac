import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CarritoService } from '../../nucleo/carrito.service';
import { SesionService } from '../../nucleo/sesion.service';
import { TiendaService } from '../../nucleo/tienda.service';

@Component({
  selector: 'app-tienda-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './tienda-layout.html',
})
export class TiendaLayout {
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  readonly carrito = inject(CarritoService);
  readonly tienda = inject(TiendaService);

  readonly nombreRol = this.sesion.nombreRol;

  buscar(valor: string): void {
    this.tienda.busqueda.set(valor);
  }

  salir(): void {
    this.sesion.cerrar();
    this.carrito.limpiar('tienda');
    this.router.navigate(['/login']);
  }
}
