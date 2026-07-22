import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

let secuencia = 0;

/**
 * Diálogo modal de confirmación para acciones destructivas (p. ej. vaciar una
 * orden). `role="dialog"` con `aria-modal`, enfoca el botón principal al abrir,
 * Escape cancela y mantiene el foco entre los botones (trampa básica).
 */
@Component({
  selector: 'sv-dialogo-confirmar',
  templateUrl: './dialogo-confirmar.html',
})
export class SvDialogoConfirmar {
  readonly abierto = input(false);
  readonly titulo = input('¿Confirmar acción?');
  readonly mensaje = input('');
  readonly textoConfirmar = input('Eliminar');
  readonly textoCancelar = input('Cancelar');
  readonly peligro = input(true);
  readonly icono = input('bi-exclamation-triangle-fill');

  readonly confirmar = output<void>();
  readonly cancelar = output<void>();

  readonly idBase = `sv-dlg-${++secuencia}`;
  private readonly botonCancelar = viewChild<ElementRef<HTMLButtonElement>>('btnCancelar');
  private readonly botonConfirmar = viewChild<ElementRef<HTMLButtonElement>>('btnConfirmar');

  constructor() {
    effect(() => {
      if (this.abierto()) this.botonConfirmar()?.nativeElement.focus();
    });
  }

  alTeclado(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.cancelar.emit();
      return;
    }
    if (e.key !== 'Tab') return;
    const cancelar = this.botonCancelar()?.nativeElement;
    const confirmar = this.botonConfirmar()?.nativeElement;
    if (!cancelar || !confirmar) return;
    const foco = document.activeElement;
    if (e.shiftKey && foco === cancelar) {
      e.preventDefault();
      confirmar.focus();
    } else if (!e.shiftKey && foco === confirmar) {
      e.preventDefault();
      cancelar.focus();
    }
  }
}
