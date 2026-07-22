import { Component, input } from '@angular/core';

/**
 * Spinner circular indeterminado. Se usa cuando no se conoce cuánto falta para
 * terminar la carga: `role="progressbar"` sin `aria-valuenow` (arco en bucle).
 */
@Component({
  selector: 'sv-spinner',
  template: `
    <span
      class="sv-spinner"
      [class.claro]="claro()"
      role="progressbar"
      [attr.aria-label]="etiqueta()"
      [style.width.px]="tamano()"
      [style.height.px]="tamano()"
    >
      <svg viewBox="0 0 44 44" aria-hidden="true" focusable="false">
        <circle class="sv-spinner-pista" cx="22" cy="22" r="19" fill="none" [attr.stroke-width]="grosor()"></circle>
        <circle class="sv-spinner-arco" cx="22" cy="22" r="19" fill="none" [attr.stroke-width]="grosor()"></circle>
      </svg>
    </span>
  `,
})
export class SvSpinner {
  readonly etiqueta = input('Cargando…');
  readonly tamano = input(40);
  readonly grosor = input(4);
  /** Variante clara para usarlo sobre fondos oscuros (p. ej. dentro de un botón azul). */
  readonly claro = input(false);
}
