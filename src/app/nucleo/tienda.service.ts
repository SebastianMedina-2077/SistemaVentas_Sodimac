import { Injectable, computed, signal } from '@angular/core';
import { PRODUCTOS } from './datos';
import { Producto } from './modelos';

/** Estado del catálogo compartido entre el topbar (búsqueda) y la grilla de productos. */
@Injectable({ providedIn: 'root' })
export class TiendaService {
  readonly busqueda = signal('');
  readonly categoria = signal('Todos');

  /** Productos filtrados por categoría y texto (nombre, SKU o marca). */
  readonly productos = computed<Producto[]>(() => {
    const q = this.busqueda().trim().toLowerCase();
    const cat = this.categoria();
    return PRODUCTOS.filter((p) => {
      const coincideCat = cat === 'Todos' || p.categoria === cat;
      const coincideTexto =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.marca.toLowerCase().includes(q);
      return coincideCat && coincideTexto;
    });
  });
}
