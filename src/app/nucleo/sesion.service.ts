import { Injectable, computed, signal } from '@angular/core';
import { Rol } from './modelos';

/**
 * Mantiene el rol autenticado durante la sesión (CUS: control de acceso por rol).
 * Es un mockup en memoria: no persiste ni valida contra backend.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly _rol = signal<Rol | null>(null);

  readonly rol = this._rol.asReadonly();
  readonly autenticado = computed(() => this._rol() !== null);
  readonly nombreRol = computed(() => this._rol()?.nombre ?? '');

  /** Iniciales para el avatar (p. ej. "Gerente de Tienda" → "GT"). */
  readonly iniciales = computed(() => {
    const nombre = this._rol()?.nombre ?? '';
    return nombre
      .split(' ')
      .filter((w) => w.length > 2)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  });

  iniciar(rol: Rol): void {
    this._rol.set(rol);
  }

  cerrar(): void {
    this._rol.set(null);
  }
}
