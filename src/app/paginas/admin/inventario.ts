import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventarioService } from '../../nucleo/inventario.service';
import { Producto } from '../../nucleo/modelos';

type TipoMov = 'entrada' | 'salida' | 'conteo';

@Component({
  selector: 'app-inventario',
  imports: [ReactiveFormsModule],
  templateUrl: './inventario.html',
})
export class Inventario {
  private readonly fb = inject(FormBuilder);
  private readonly inventario = inject(InventarioService);

  readonly productos = this.inventario.productos;
  readonly alertas = this.inventario.alertas().length;

  readonly formVisible = signal(false);
  readonly tipo = signal<TipoMov>('entrada');
  readonly enviado = signal(false);
  readonly exito = signal('');

  readonly form = this.fb.nonNullable.group({
    sku: ['', Validators.required],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    motivo: [''],
  });

  estadoDe(p: Producto) {
    return this.inventario.estadoDe(p);
  }

  abrir(tipo: TipoMov): void {
    this.tipo.set(tipo);
    this.formVisible.set(true);
    this.enviado.set(false);
    this.exito.set('');
    this.form.reset({ sku: '', cantidad: 1, motivo: '' });
  }

  cerrar(): void {
    this.formVisible.set(false);
  }

  invalido(campo: 'sku' | 'cantidad'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  registrar(): void {
    this.enviado.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { sku, cantidad } = this.form.getRawValue();
    const etiqueta = { entrada: 'Entrada', salida: 'Salida', conteo: 'Conteo cíclico' }[this.tipo()];
    this.exito.set(`${etiqueta} registrada: ${cantidad} unidad(es) del SKU ${sku}. Stock actualizado.`);
    this.formVisible.set(false);
  }
}
