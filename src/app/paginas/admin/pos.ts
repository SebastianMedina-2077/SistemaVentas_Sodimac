import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../nucleo/carrito.service';
import { PRODUCTOS } from '../../nucleo/datos';
import { Producto } from '../../nucleo/modelos';
import { SolesPipe } from '../../nucleo/soles.pipe';

@Component({
  selector: 'app-pos',
  imports: [FormsModule, SolesPipe],
  templateUrl: './pos.html',
})
export class Pos {
  readonly carrito = inject(CarritoService);

  readonly productos = PRODUCTOS;
  readonly metodos = ['Efectivo', 'Tarjeta', 'CMR Falabella'];

  readonly metodoPago = signal('Efectivo');
  readonly sku = signal('');
  readonly errorSku = signal('');
  readonly comprobante = signal<string | null>(null);

  readonly lineas = computed(() => this.carrito.lineas('pos'));
  readonly totales = computed(() => this.carrito.totales('pos'));
  readonly hayItems = computed(() => this.lineas().length > 0);

  agregar(p: Producto): void {
    this.carrito.agregar('pos', p.sku);
    this.comprobante.set(null);
  }

  /** Búsqueda manual por SKU (flujo alterno CUS-01: código no reconocido). */
  agregarPorSku(): void {
    const codigo = this.sku().trim().toUpperCase();
    if (!codigo) return;
    const encontrado = this.productos.find((p) => p.sku === codigo);
    if (encontrado) {
      this.carrito.agregar('pos', encontrado.sku);
      this.sku.set('');
      this.errorSku.set('');
    } else {
      this.errorSku.set(`SKU "${codigo}" no encontrado. Verifica el código.`);
    }
  }

  incrementar(sku: string): void { this.carrito.agregar('pos', sku); }
  decrementar(sku: string): void { this.carrito.disminuir('pos', sku); }

  limpiar(): void {
    this.carrito.limpiar('pos');
    this.comprobante.set(null);
  }

  cobrar(): void {
    if (!this.hayItems()) return;
    // Mock de emisión de comprobante electrónico (CUS-08).
    this.comprobante.set('B001-004' + Math.floor(500 + this.lineas().length * 7));
    this.carrito.limpiar('pos');
  }
}
