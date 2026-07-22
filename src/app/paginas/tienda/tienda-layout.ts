import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CarritoService } from '../../nucleo/carrito.service';
import { PRODUCTOS } from '../../nucleo/datos';
import { SesionService } from '../../nucleo/sesion.service';
import { TiendaService } from '../../nucleo/tienda.service';
import { OpcionCombo, SvCombobox } from '../../nucleo/ui/combobox';

@Component({
  selector: 'app-tienda-layout',
  imports: [RouterOutlet, RouterLink, SvCombobox],
  templateUrl: './tienda-layout.html',
})
export class TiendaLayout {
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  readonly carrito = inject(CarritoService);
  readonly tienda = inject(TiendaService);

  readonly nombreRol = this.sesion.nombreRol;

  readonly opciones: OpcionCombo[] = PRODUCTOS.map((p) => ({
    id: p.sku,
    etiqueta: p.nombre,
    sub: `${p.marca} · ${p.categoria}`,
    imagen: p.imagen,
  }));

  buscar(valor: string): void {
    this.tienda.busqueda.set(valor);
  }

  salir(): void {
    this.sesion.cerrar();
    this.carrito.limpiar('tienda');
    this.router.navigate(['/login']);
  }
}
