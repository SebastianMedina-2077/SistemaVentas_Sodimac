import { Injectable, inject } from '@angular/core';
import { CatalogoService } from './catalogo.service';
import { EstadoStockInfo, Producto } from './modelos';

// Estado de stock y alertas de reposición (CUS-05).
@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly catalogo = inject(CatalogoService);

  /** Lista reactiva de productos (fuente: CatalogoService). */
  get productos(): Producto[] {
    return this.catalogo.productos();
  }

  estadoDe(p: Producto): EstadoStockInfo {
    if (p.stock <= p.minimo * 0.5) {
      return { estado: 'critico', etiqueta: 'Crítico', color: '#b91c1c', fondo: '#fef2f2', punto: '#ef4444' };
    }
    if (p.stock <= p.minimo) {
      return { estado: 'bajo', etiqueta: 'Bajo', color: '#b45309', fondo: '#fffbeb', punto: '#f59e0b' };
    }
    return { estado: 'ok', etiqueta: 'En stock', color: '#15803d', fondo: '#f0fdf4', punto: '#22c55e' };
  }

  // Productos en o por debajo del stock mínimo.
  alertas(): Producto[] {
    return this.productos.filter((p) => this.estadoDe(p).estado !== 'ok');
  }
}
