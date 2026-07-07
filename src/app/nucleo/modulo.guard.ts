import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { ModuloAdmin } from './modelos';
import { SesionService } from './sesion.service';

// Restringe cada módulo de /admin al rol; si no tiene acceso, lo lleva a su módulo inicial.
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
