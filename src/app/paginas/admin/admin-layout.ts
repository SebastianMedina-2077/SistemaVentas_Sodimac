import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { CarritoService } from '../../nucleo/carrito.service';
import { MODULOS } from '../../nucleo/datos';
import { SesionService } from '../../nucleo/sesion.service';

interface ItemNav { ruta: string; nombre: string; icono: string; }
interface GrupoNav { grupo: string; items: ItemNav[]; }

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgTemplateOutlet],
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  private readonly sesion = inject(SesionService);
  private readonly carrito = inject(CarritoService);
  private readonly router = inject(Router);

  readonly nombreRol = this.sesion.nombreRol;
  readonly iniciales = this.sesion.iniciales;
  readonly anio = new Date().getFullYear();

  readonly menuAbierto = signal(false);
  private readonly botonMenu = viewChild<ElementRef<HTMLButtonElement>>('botonMenu');

  // Módulos permitidos del rol activo, agrupados en el orden del catálogo.
  readonly grupos = computed<GrupoNav[]>(() => {
    const permitidos = this.sesion.rol()?.modulos ?? [];
    const orden: string[] = [];
    const mapa = new Map<string, GrupoNav>();
    for (const m of MODULOS) {
      if (!permitidos.includes(m.clave)) continue;
      if (!mapa.has(m.grupo)) {
        mapa.set(m.grupo, { grupo: m.grupo, items: [] });
        orden.push(m.grupo);
      }
      mapa.get(m.grupo)!.items.push({ ruta: m.clave, nombre: m.nombre, icono: m.icono });
    }
    return orden.map((g) => mapa.get(g)!);
  });

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly titulo = computed(() => {
    const seg = this.url().split('/').filter(Boolean).pop() ?? 'dashboard';
    return MODULOS.find((m) => m.clave === seg)?.nombre ?? 'Panel administrativo';
  });

  constructor() {
    // Bloquea el scroll del cuerpo mientras el drawer móvil está abierto.
    effect(() => {
      document.body.style.overflow = this.menuAbierto() ? 'hidden' : '';
    });
  }

  abrirMenu(): void {
    this.menuAbierto.set(true);
  }

  cerrarMenu(): void {
    if (!this.menuAbierto()) return;
    this.menuAbierto.set(false);
    this.botonMenu()?.nativeElement.focus();
  }

  salir(): void {
    this.sesion.cerrar();
    this.carrito.limpiar('pos');
    this.router.navigate(['/login']);
  }
}
