import { Component, computed, inject, signal } from '@angular/core';
import { InventarioService } from '../../nucleo/inventario.service';
import { Producto } from '../../nucleo/modelos';
import { SolesPipe } from '../../nucleo/soles.pipe';

/**
 * Consulta de productos para el asesor de ventas. Solo lectura: permite buscar
 * un producto y ver su stock, ubicación, características y para qué sirve.
 * No vende ni edita.
 */
@Component({
  selector: 'app-consulta',
  imports: [SolesPipe],
  templateUrl: './consulta.html',
})
export class Consulta {
  private readonly inventario = inject(InventarioService);

  readonly termino = signal('');

  readonly resultados = computed(() => {
    const q = this.termino().trim().toLowerCase();
    if (!q) return this.inventario.productos;
    return this.inventario.productos.filter((p) =>
      `${p.nombre} ${p.sku} ${p.categoria} ${p.marca}`.toLowerCase().includes(q),
    );
  });

  buscar(valor: string): void {
    this.termino.set(valor);
  }

  estadoDe(p: Producto) {
    return this.inventario.estadoDe(p);
  }
}
