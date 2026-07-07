import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface VentaEncontrada {
  comprobante: string;
  fecha: string;
  cliente: string;
  total: number;
  items: { nombre: string; sku: string; precio: number }[];
}

@Component({
  selector: 'app-devoluciones',
  imports: [ReactiveFormsModule],
  templateUrl: './devoluciones.html',
})
export class Devoluciones {
  private readonly fb = inject(FormBuilder);

  readonly motivos = ['Producto defectuoso', 'No cumple expectativas', 'Producto equivocado', 'Arrepentimiento de compra'];

  readonly enviado = signal(false);
  readonly venta = signal<VentaEncontrada | null>(null);
  readonly resolucion = signal<'reembolso' | 'cambio'>('reembolso');
  readonly procesado = signal('');

  readonly buscador = this.fb.nonNullable.group({
    comprobante: ['', [Validators.required, Validators.pattern(/^[A-Za-z]\d{3}-\d{6}$/)]],
  });

  readonly formDev = this.fb.nonNullable.group({
    motivo: ['', Validators.required],
  });

  get invalidoComprobante(): boolean {
    const c = this.buscador.controls.comprobante;
    return c.invalid && (c.touched || this.enviado());
  }

  buscar(): void {
    this.enviado.set(true);
    this.procesado.set('');
    if (this.buscador.invalid) {
      this.buscador.markAllAsTouched();
      return;
    }
    // Mock: se "encuentra" la venta original (CUS-04).
    this.venta.set({
      comprobante: this.buscador.getRawValue().comprobante.toUpperCase(),
      fecha: '03/07/2026',
      cliente: 'Juan Pérez',
      total: 268.8,
      items: [
        { nombre: 'Taladro Percutor GSB 550W', sku: 'FER-001', precio: 189.9 },
        { nombre: 'Set Destornilladores 6 pzs', sku: 'FER-032', precio: 45.0 },
      ],
    });
  }

  procesar(): void {
    if (this.formDev.invalid) {
      this.formDev.markAllAsTouched();
      return;
    }
    const tipo = this.resolucion() === 'reembolso' ? 'Reembolso' : 'Cambio';
    this.procesado.set(`${tipo} procesado para ${this.venta()!.comprobante}. Nota de crédito emitida.`);
    this.venta.set(null);
    this.enviado.set(false);
    this.buscador.reset({ comprobante: '' });
    this.formDev.reset({ motivo: '' });
  }
}
