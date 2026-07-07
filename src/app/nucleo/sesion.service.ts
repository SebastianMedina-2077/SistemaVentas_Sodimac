import { Injectable, computed, signal } from '@angular/core';
import { Rol } from './modelos';

// Guarda el rol autenticado en memoria durante la sesión.
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly _rol = signal<Rol | null>(null);

  readonly rol = this._rol.asReadonly();
  readonly autenticado = computed(() => this._rol() !== null);
  readonly nombreRol = computed(() => this._rol()?.nombre ?? '');

  // Iniciales para el avatar ("Gerente de Tienda" → "GT").
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
