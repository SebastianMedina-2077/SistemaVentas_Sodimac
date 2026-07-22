import { Component, computed, inject, signal } from '@angular/core';
import { InventarioService } from '../../nucleo/inventario.service';
import { Producto } from '../../nucleo/modelos';
import { SolesPipe } from '../../nucleo/soles.pipe';
import { OpcionCombo, SvCombobox } from '../../nucleo/ui/combobox';
import { SvImagen } from '../../nucleo/ui/imagen';
import { SvSpinner } from '../../nucleo/ui/spinner';
import { ToastService } from '../../nucleo/ui/toast.service';

interface GrupoCategoria {
  categoria: string;
  items: Producto[];
}

// Consulta de solo lectura para el asesor: buscar, ver stock y ficha detallada.
@Component({
  selector: 'app-consulta',
  imports: [SolesPipe, SvCombobox, SvImagen, SvSpinner],
  templateUrl: './consulta.html',
  host: { class: 'd-block h-100' },
})
export class Consulta {
  private readonly inventario = inject(InventarioService);
  private readonly toast = inject(ToastService);

  readonly termino = signal('');
  readonly seleccionado = signal<Producto | null>(null);
  readonly cargando = signal(false);
  private peticion = 0;

  readonly resultados = computed(() => {
    const q = this.termino().trim().toLowerCase();
    if (!q) return this.inventario.productos;
    return this.inventario.productos.filter((p) =>
      `${p.nombre} ${p.sku} ${p.categoria} ${p.marca}`.toLowerCase().includes(q),
    );
  });

  readonly grupos = computed<GrupoCategoria[]>(() => {
    const mapa = new Map<string, Producto[]>();
    for (const p of this.resultados()) {
      (mapa.get(p.categoria) ?? mapa.set(p.categoria, []).get(p.categoria)!).push(p);
    }
    return [...mapa].map(([categoria, items]) => ({ categoria, items }));
  });

  readonly opciones = computed<OpcionCombo[]>(() =>
    this.inventario.productos.map((p) => ({
      id: p.sku,
      etiqueta: p.nombre,
      sub: `${p.sku} · ${p.categoria}`,
      imagen: p.imagen,
    })),
  );

  readonly recomendaciones = computed<Producto[]>(() => {
    const p = this.seleccionado();
    if (!p) return [];
    return this.inventario.productos
      .filter((x) => x.categoria === p.categoria && x.sku !== p.sku)
      .slice(0, 4);
  });

  buscar(valor: string): void {
    this.termino.set(valor);
  }

  estadoDe(p: Producto) {
    return this.inventario.estadoDe(p);
  }

  // El asesor pide a logística reponer un producto para el cliente.
  solicitar(p: Producto): void {
    this.toast.mostrar('Solicitud enviada a logística', `${p.nombre} — se pidió traer stock de almacén a góndola.`, 'info');
  }

  // Simula la carga de la ficha; luego será una llamada al backend.
  verDetalle(sku: string): void {
    const p = this.inventario.productos.find((x) => x.sku === sku);
    if (!p) return;
    const id = ++this.peticion;
    this.cargando.set(true);
    setTimeout(() => {
      if (id !== this.peticion) return;
      this.seleccionado.set(p);
      this.cargando.set(false);
    }, 650);
  }
}
