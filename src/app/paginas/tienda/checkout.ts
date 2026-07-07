import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../nucleo/carrito.service';
import { METODOS_PAGO } from '../../nucleo/datos';
import { SolesPipe } from '../../nucleo/soles.pipe';

type Modalidad = 'envio' | 'retiro';

const TIENDAS = ['Homecenter Lima Norte', 'Homecenter Atocongo', 'Homecenter San Isidro', 'Maestro Comas'];

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, SolesPipe],
  templateUrl: './checkout.html',
})
export class Checkout {
  private readonly fb = inject(FormBuilder);
  readonly carrito = inject(CarritoService);

  readonly metodos = METODOS_PAGO;
  readonly tiendas = TIENDAS;

  readonly enviado = signal(false);
  readonly confirmado = signal(false);
  readonly modalidad = signal<Modalidad>('envio');

  readonly lineas = computed(() => this.carrito.lineas('tienda'));
  readonly totales = computed(() => this.carrito.totales('tienda'));
  readonly hayItems = computed(() => this.lineas().length > 0);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    documento: ['', [Validators.required, Validators.pattern(/^\d{8}(\d{3})?$/)]],
    telefono: ['', [Validators.required, Validators.pattern(/^9\d{8}$/)]],
    direccion: ['', Validators.required],
    distrito: ['', Validators.required],
    tienda: [''],
    metodoPago: ['', Validators.required],
  });

  setModalidad(m: Modalidad): void {
    this.modalidad.set(m);
    const { direccion, distrito, tienda } = this.form.controls;
    if (m === 'retiro') {
      tienda.setValidators(Validators.required);
      direccion.clearValidators();
      distrito.clearValidators();
    } else {
      tienda.clearValidators();
      direccion.setValidators(Validators.required);
      distrito.setValidators(Validators.required);
    }
    [direccion, distrito, tienda].forEach((c) => c.updateValueAndValidity());
  }

  invalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.enviado());
  }

  confirmar(): void {
    this.enviado.set(true);
    if (this.form.invalid || !this.hayItems()) {
      this.form.markAllAsTouched();
      return;
    }
    this.confirmado.set(true);
    this.carrito.limpiar('tienda');
  }
}
