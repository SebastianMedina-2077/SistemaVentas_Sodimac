import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { ModuloAdmin } from './modelos';
import { SesionService } from './sesion.service';

/**
 * Control de acceso por rol dentro del panel. Toma el módulo del segmento de
 * ruta (p. ej. 'inventario') y verifica que el rol activo lo tenga permitido.
 * Si no, redirige a su módulo inicial. Así un cajero que fuerce /admin/inventario
 * termina en /admin/pos.
 */
export const moduloGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  const rol = sesion.rol();

  if (!rol) return router.createUrlTree(['/login']);

  const modulo = route.routeConfig?.path as ModuloAdmin | undefined;
  if (modulo && rol.modulos.includes(modulo)) return true;

  const destino = rol.moduloInicial ?? 'login';
  return router.createUrlTree(['/admin', destino]);
};
