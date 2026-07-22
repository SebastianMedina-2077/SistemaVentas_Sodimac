import { Injectable, signal } from '@angular/core';
import { PRODUCTOS } from './datos';
import { Producto } from './modelos';

/**
 * Fuente única del catálogo en memoria. Mantiene los productos en una señal
 * para que las ediciones (precio, stock, imagen, etc.) se reflejen en todas
 * las vistas. Luego se reemplazaría por llamadas al backend.
 */
@Injectable({ providedIn: 'root' })
export class CatalogoService {
  readonly productos = signal<Producto[]>(PRODUCTOS);

  buscar(sku: string): Producto | undefined {
    return this.productos().find((p) => p.sku === sku);
  }

  actualizar(sku: string, cambios: Partial<Producto>): void {
    this.productos.update((ps) =>
      ps.map((p) => {
        if (p.sku !== sku) return p;
        const actualizado = { ...p, ...cambios };
        actualizado.stock = actualizado.stockGondola + actualizado.stockAlmacen;
        return actualizado;
      }),
    );
  }

  agregar(p: Producto): void {
    this.productos.update((ps) => [{ ...p, stock: p.stockGondola + p.stockAlmacen }, ...ps]);
  }
}
