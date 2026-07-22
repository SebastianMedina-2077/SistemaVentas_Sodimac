import { Component, input, signal } from '@angular/core';

/**
 * Imagen con respaldo: intenta la URL de internet y, si falla, muestra la
 * ilustración local para que nunca quede una imagen rota.
 */
@Component({
  selector: 'sv-imagen',
  template: `
    <img [src]="error() ? fallback() : src()" [alt]="alt()" loading="lazy" (error)="fallar()" />
  `,
  host: { class: 'sv-imagen' },
})
export class SvImagen {
  readonly src = input('');
  readonly fallback = input('');
  readonly alt = input('');
  readonly error = signal(false);

  fallar(): void {
    if (!this.error()) this.error.set(true);
  }
}
