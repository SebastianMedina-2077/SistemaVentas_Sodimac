import { Component, ElementRef, computed, inject, input, output, signal, viewChild } from '@angular/core';

export interface OpcionCombo {
  id: string;
  etiqueta: string;
  sub?: string;
  imagen?: string;
  icono?: string;
}

let secuencia = 0;

/**
 * Combobox accesible con popup de tipo listbox (patrón WAI-ARIA).
 * Mantiene el foco en el input mediante `aria-activedescendant` y soporta
 * flechas, Enter y Escape. No enfoca solo al montarse.
 */
@Component({
  selector: 'sv-combobox',
  templateUrl: './combobox.html',
  host: { '(document:pointerdown)': 'alClicFuera($event)' },
})
export class SvCombobox {
  readonly etiqueta = input('Buscar');
  readonly placeholder = input('');
  readonly opciones = input<OpcionCombo[]>([]);
  readonly maximo = input(8);
  readonly mostrarEtiqueta = input(true);

  readonly buscar = output<string>();
  readonly seleccion = output<OpcionCombo>();

  readonly texto = signal('');
  readonly abierto = signal(false);
  readonly activo = signal(-1);

  readonly idBase = `sv-combo-${++secuencia}`;
  readonly listboxId = `${this.idBase}-lb`;

  private readonly host = inject(ElementRef<HTMLElement>);
  readonly entrada = viewChild<ElementRef<HTMLInputElement>>('entrada');

  readonly filtradas = computed(() => {
    const q = this.texto().trim().toLowerCase();
    const base = this.opciones();
    const lista = !q
      ? base
      : base.filter((o) => `${o.etiqueta} ${o.sub ?? ''}`.toLowerCase().includes(q));
    return lista.slice(0, this.maximo());
  });

  opcionId(i: number): string {
    return `${this.idBase}-op-${i}`;
  }

  activedescendant(): string | null {
    const i = this.activo();
    return this.abierto() && i >= 0 && i < this.filtradas().length ? this.opcionId(i) : null;
  }

  alEscribir(valor: string): void {
    this.texto.set(valor);
    this.abierto.set(true);
    this.activo.set(-1);
    this.buscar.emit(valor);
  }

  alEnfocar(): void {
    if (this.filtradas().length) this.abierto.set(true);
  }

  teclado(e: KeyboardEvent): void {
    const n = this.filtradas().length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this.abierto()) this.abierto.set(true);
        this.activo.set(n ? (this.activo() + 1) % n : -1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!this.abierto()) this.abierto.set(true);
        this.activo.set(n ? (this.activo() - 1 + n) % n : -1);
        break;
      case 'Enter': {
        const i = this.activo();
        if (this.abierto() && i >= 0 && i < n) {
          e.preventDefault();
          this.elegir(this.filtradas()[i]);
        }
        break;
      }
      case 'Escape':
        if (this.abierto()) {
          e.preventDefault();
          this.cerrar();
        }
        break;
      case 'Tab':
        this.cerrar();
        break;
    }
  }

  elegir(op: OpcionCombo): void {
    this.texto.set(op.etiqueta);
    this.cerrar();
    this.seleccion.emit(op);
    this.buscar.emit(op.etiqueta);
  }

  cerrar(): void {
    this.abierto.set(false);
    this.activo.set(-1);
  }

  alClicFuera(e: Event): void {
    if (!this.host.nativeElement.contains(e.target as Node)) this.cerrar();
  }
}
