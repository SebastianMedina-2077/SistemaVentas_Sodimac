import { Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

// Contenedor global de notificaciones (adaptado del patrón de tarjeta de éxito).
@Component({
  selector: 'sv-toaster',
  template: `
    <div class="sv-toaster" aria-live="polite" aria-atomic="false">
      @for (t of toast.toasts(); track t.id) {
        <div class="sv-toast sv-toast-{{ t.tipo }}" role="status">
          <i class="bi flex-shrink-0" [class.bi-check-circle-fill]="t.tipo === 'exito'"
             [class.bi-info-circle-fill]="t.tipo === 'info'"
             [class.bi-exclamation-triangle-fill]="t.tipo === 'error'"></i>
          <div class="flex-grow-1">
            <div class="fw-bold">{{ t.titulo }}</div>
            @if (t.mensaje) { <div class="sv-toast-msg">{{ t.mensaje }}</div> }
          </div>
          <button type="button" class="sv-toast-cerrar" (click)="toast.cerrar(t.id)" aria-label="Descartar notificación">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
      }
    </div>
  `,
})
export class SvToaster {
  readonly toast = inject(ToastService);
}
