import { Injectable, signal } from '@angular/core';

export type TipoToast = 'exito' | 'info' | 'error';

export interface Toast {
  id: number;
  tipo: TipoToast;
  titulo: string;
  mensaje?: string;
}

/**
 * Servicio de notificaciones (toasts). Muestra avisos no bloqueantes para
 * acciones que no usan modal (ventas, registros, etc.). Se autodescartan.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private secuencia = 0;
  readonly toasts = signal<Toast[]>([]);

  mostrar(titulo: string, mensaje = '', tipo: TipoToast = 'exito', duracion = 5000): void {
    const id = ++this.secuencia;
    this.toasts.update((ts) => [...ts, { id, tipo, titulo, mensaje }]);
    if (duracion > 0) setTimeout(() => this.cerrar(id), duracion);
  }

  cerrar(id: number): void {
    this.toasts.update((ts) => ts.filter((t) => t.id !== id));
  }
}
