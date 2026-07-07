import { Injectable, Signal, signal } from '@angular/core';
import { PRODUCTOS } from './datos';
import { LineaCarrito, Producto, Totales } from './modelos';

type Canal = 'tienda' | 'pos';

const IGV = 0.18;

// Dos carritos independientes en memoria: 'tienda' (compra online) y 'pos' (ticket del cajero).
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly indice = new Map(PRODUCTOS.map((p) => [p.sku, p]));

  private readonly carritos: Record<Canal, ReturnType<typeof signal<Record<string, number>>>> = {
    tienda: signal<Record<string, number>>({}),
    pos: signal<Record<string, number>>({}),
  };

  // Señal cruda (sku → cantidad) del canal.
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

  // Líneas del carrito (lee la señal, por eso es reactivo).
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

  // El precio ya incluye IGV; aquí se desglosa el 18 %.
  totales(canal: Canal): Totales {
    const total = this.lineas(canal).reduce((acc, l) => acc + l.subtotal, 0);
    const subtotal = total / (1 + IGV);
    return { total, subtotal, igv: total - subtotal, unidades: this.unidades(canal) };
  }
}
