import { Injectable } from '@angular/core';
import { PRODUCTOS } from './datos';
import { EstadoStockInfo, Producto } from './modelos';

/** Deriva el estado de stock y las alertas de reposición (CUS-05). */
@Injectable({ providedIn: 'root' })
export class InventarioService {
  readonly productos = PRODUCTOS;

  estadoDe(p: Producto): EstadoStockInfo {
    if (p.stock <= p.minimo * 0.5) {
      return { estado: 'critico', etiqueta: 'Crítico', color: '#b91c1c', fondo: '#fef2f2', punto: '#ef4444' };
    }
    if (p.stock <= p.minimo) {
      return { estado: 'bajo', etiqueta: 'Bajo', color: '#b45309', fondo: '#fffbeb', punto: '#f59e0b' };
    }
    return { estado: 'ok', etiqueta: 'En stock', color: '#15803d', fondo: '#f0fdf4', punto: '#22c55e' };
  }

  /** Productos por debajo o en el nivel mínimo. */
  alertas(): Producto[] {
    return this.productos.filter((p) => this.estadoDe(p).estado !== 'ok');
  }
}
