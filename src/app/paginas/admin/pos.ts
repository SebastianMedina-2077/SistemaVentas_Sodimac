import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../nucleo/carrito.service';
import { CatalogoService } from '../../nucleo/catalogo.service';
import { LineaCarrito, Producto } from '../../nucleo/modelos';
import { SolesPipe } from '../../nucleo/soles.pipe';
import { OpcionCombo, SvCombobox } from '../../nucleo/ui/combobox';
import { SvDialogoConfirmar } from '../../nucleo/ui/dialogo-confirmar';
import { ToastService } from '../../nucleo/ui/toast.service';

interface Comprobante {
  tipo: 'boleta' | 'factura';
  serie: string;
  numero: string;
  fecha: Date;
  doc: string;
  razonSocial: string;
  metodo: string;
  lineas: LineaCarrito[];
  subtotal: number;
  igv: number;
  total: number;
}

interface OrdenEnEspera {
  id: string;
  mapa: Record<string, number>;
  total: number;
  items: number;
  cliente: string;
}

@Component({
  selector: 'app-pos',
  imports: [FormsModule, DatePipe, SolesPipe, SvCombobox, SvDialogoConfirmar],
  templateUrl: './pos.html',
})
export class Pos {
  readonly carrito = inject(CarritoService);
  private readonly toast = inject(ToastService);
  private readonly catalogo = inject(CatalogoService);

  get productos(): Producto[] {
    return this.catalogo.productos();
  }
  readonly metodos = ['Efectivo', 'Tarjeta', 'CMR Falabella'];

  // Datos del emisor (Sodimac Perú S.A., información pública de RUC).
  readonly empresa = {
    nombre: 'SODIMAC PERÚ S.A.',
    ruc: '20389230724',
    direccion: 'Av. Angamos Este 1805, Surquillo - Lima',
    tienda: 'Homecenter Lima Norte',
  };

  readonly metodoPago = signal('Efectivo');
  readonly tipoComprobante = signal<'boleta' | 'factura'>('boleta');
  readonly doc = signal('');
  readonly razonSocial = signal('');
  readonly confirmarVaciar = signal(false);
  readonly comprobante = signal<Comprobante | null>(null);
  readonly ordenes = signal<OrdenEnEspera[]>([]);

  readonly opciones = computed<OpcionCombo[]>(() =>
    this.productos.map((p) => ({
      id: p.sku,
      etiqueta: p.nombre,
      sub: `${p.sku} · ${new SolesPipe().transform(p.precio)}`,
      imagen: p.imagen,
    })),
  );

  readonly lineas = computed(() => this.carrito.lineas('pos'));
  readonly totales = computed(() => this.carrito.totales('pos'));
  readonly hayItems = computed(() => this.lineas().length > 0);

  agregar(p: Producto): void {
    this.carrito.agregar('pos', p.sku);
  }

  agregarPorSku(sku: string): void {
    this.carrito.agregar('pos', sku);
  }

  incrementar(sku: string): void { this.carrito.agregar('pos', sku); }
  decrementar(sku: string): void { this.carrito.disminuir('pos', sku); }

  // Guarda la venta en curso para atender a otro cliente y libera la caja.
  guardarOrden(): void {
    if (!this.hayItems()) return;
    const id = 'ESP-' + Math.floor(100 + this.ordenes().length * 7 + 3);
    this.ordenes.update((o) => [
      ...o,
      { id, mapa: { ...this.carrito.crudo('pos')() }, total: this.totales().total, items: this.totales().unidades, cliente: this.doc().trim() || 'Genérico' },
    ]);
    this.carrito.limpiar('pos');
    this.doc.set('');
    this.razonSocial.set('');
    this.toast.mostrar('Orden guardada', `${id} quedó en espera. Puedes atender a otro cliente.`, 'info');
  }

  retomar(o: OrdenEnEspera): void {
    this.carrito.establecer('pos', o.mapa);
    this.ordenes.update((list) => list.filter((x) => x.id !== o.id));
  }

  vaciar(): void {
    this.carrito.limpiar('pos');
    this.confirmarVaciar.set(false);
  }

  cobrar(): void {
    if (!this.hayItems()) return;
    const t = this.totales();
    const esFactura = this.tipoComprobante() === 'factura';
    this.comprobante.set({
      tipo: this.tipoComprobante(),
      serie: esFactura ? 'F001' : 'B001',
      numero: String(Math.floor(500 + this.lineas().length * 7)).padStart(8, '0'),
      fecha: new Date(),
      // Sin documento se emite a cliente genérico con DNI 000000000.
      doc: this.doc().trim() || '000000000',
      razonSocial: esFactura ? this.razonSocial().trim() || 'CLIENTE VARIOS' : '',
      metodo: this.metodoPago(),
      lineas: this.lineas(),
      subtotal: t.subtotal,
      igv: t.igv,
      total: t.total,
    });
    this.carrito.limpiar('pos');
  }

  nuevaVenta(): void {
    this.comprobante.set(null);
    this.doc.set('');
    this.razonSocial.set('');
    this.tipoComprobante.set('boleta');
  }
}
