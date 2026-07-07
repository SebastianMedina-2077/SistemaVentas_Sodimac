import { Injectable, Signal, signal } from '@angular/core';
import { PRODUCTOS } from './datos';
import { LineaCarrito, Producto, Totales } from './modelos';

type Canal = 'tienda' | 'pos';

const IGV = 0.18;

/**
 * Gestiona dos "carritos" independientes en memoria:
 *  - `tienda`: carrito del cliente en la compra en línea (CUS-02).
 *  - `pos`: ticket de venta del cajero en el punto de venta (CUS-01).
 */
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly indice = new Map(PRODUCTOS.map((p) => [p.sku, p]));

  private readonly carritos: Record<Canal, ReturnType<typeof signal<Record<string, number>>>> = {
    tienda: signal<Record<string, number>>({}),
    pos: signal<Record<string, number>>({}),
  };

  /** Señal cruda (sku → cantidad) del canal indicado. */
  crudo(canal: Canal): Signal<Record<string, number>> {
    return this.carritos[canal].asReadonly();
  }

  agregar(canal: Canal, sku: string): void {
    this.carritos[canal].update((c) => ({ ...c, [sku]: (c[sku] ?? 0) + 1 }));
  }

  disminuir(canal: Canal, sku: string): void {
    this.carritos[canal].update((c) => {
      const copia = { ...c };
      copia[sku] = (copia[sku] ?? 0) - 1;
      if (copia[sku] <= 0) delete copia[sku];
      return copia;
    });
  }

  quitar(canal: Canal, sku: string): void {
    this.carritos[canal].update((c) => {
      const copia = { ...c };
      delete copia[sku];
      return copia;
    });
  }

  limpiar(canal: Canal): void {
    this.carritos[canal].set({});
  }

  /** Líneas materializadas del carrito (lee la señal → reactivo). */
  lineas(canal: Canal): LineaCarrito[] {
    const mapa = this.carritos[canal]();
    return Object.keys(mapa).map((sku) => {
      const producto = this.indice.get(sku) as Producto;
      const cantidad = mapa[sku];
      return { producto, cantidad, subtotal: producto.precio * cantidad };
    });
  }

  unidades(canal: Canal): number {
    return Object.values(this.carritos[canal]()).reduce((a, b) => a + b, 0);
  }

  /** Total con IGV incluido; se desglosa subtotal + IGV (18 %). */
  totales(canal: Canal): Totales {
    const total = this.lineas(canal).reduce((acc, l) => acc + l.subtotal, 0);
    const subtotal = total / (1 + IGV);
    return { total, subtotal, igv: total - subtotal, unidades: this.unidades(canal) };
  }
}
