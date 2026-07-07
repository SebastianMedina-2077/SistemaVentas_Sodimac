import { Component, inject } from '@angular/core';
import { InventarioService } from '../../nucleo/inventario.service';
import {
  TOP_PRODUCTOS,
  VENTAS_POR_CATEGORIA,
  VENTAS_POR_TURNO,
} from '../../nucleo/reportes';
import { SolesPipe } from '../../nucleo/soles.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [SolesPipe],
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly inventario = inject(InventarioService);

  readonly topProductos = TOP_PRODUCTOS;
  readonly alertas = this.inventario.alertas().length;

  private readonly maxCat = Math.max(...VENTAS_POR_CATEGORIA.map((c) => c.monto));
  readonly categorias = VENTAS_POR_CATEGORIA.map((c) => ({
    ...c,
    pct: Math.round((c.monto / this.maxCat) * 100),
  }));

  private readonly maxTurno = Math.max(...VENTAS_POR_TURNO.map((t) => t.monto));
  readonly turnos = VENTAS_POR_TURNO.map((t) => ({
    ...t,
    pct: Math.round((t.monto / this.maxTurno) * 100),
  }));
}
