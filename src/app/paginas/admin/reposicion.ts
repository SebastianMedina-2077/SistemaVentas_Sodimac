import { Component, computed, inject, signal } from '@angular/core';
import { InventarioService } from '../../nucleo/inventario.service';
import { SvDialogoConfirmar } from '../../nucleo/ui/dialogo-confirmar';
import { PasoStepper, SvStepper } from '../../nucleo/ui/stepper';

interface FilaReposicion {
  sku: string;
  nombre: string;
  categoria: string;
  stock: number;
  minimo: number;
  sugerido: number;
  seleccionado: boolean;
}

// Reposición de stock: genera órdenes de compra para productos bajo el mínimo.
@Component({
  selector: 'app-reposicion',
  imports: [SvDialogoConfirmar, SvStepper],
  template: `
    <div class="d-flex flex-column gap-3 sv-anim">
      <div class="d-flex align-items-center gap-3 rounded-3 p-3" style="background:#fdecec;border:1px solid #f7c4c8">
        <span class="sv-rol-avatar" style="width:38px;height:38px;background:var(--sv-rojo);font-size:1rem"><i class="bi bi-truck"></i></span>
        <div class="small" style="color:#8a1015">
          <b>{{ filas().length }} productos</b> están en o por debajo del mínimo. Selecciona y genera la orden de compra.
        </div>
      </div>

      <div class="sv-card p-0 overflow-hidden">
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
          <div class="form-check mb-0">
            <input class="form-check-input" type="checkbox" id="rep-todos" [checked]="todosMarcados()" (change)="marcarTodos($any($event.target).checked)" />
            <label class="form-check-label small fw-semibold" for="rep-todos">Seleccionar todo</label>
          </div>
          <button type="button" class="btn btn-primary btn-sm" [disabled]="!seleccionados()" (click)="pedirOC.set(true)">
            <i class="bi bi-file-earmark-plus me-1"></i> Generar orden ({{ seleccionados() }})
          </button>
        </div>
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr class="text-uppercase text-tenue small" style="background:#f5f7fa">
                <th class="px-3 py-2"></th>
                <th class="py-2 fw-semibold">Producto</th>
                <th class="py-2 fw-semibold text-end">Stock</th>
                <th class="py-2 fw-semibold text-end">Mínimo</th>
                <th class="py-2 fw-semibold text-end pe-3">Sugerido a pedir</th>
              </tr>
            </thead>
            <tbody>
              @for (f of filas(); track f.sku) {
                <tr>
                  <td class="px-3">
                    <input class="form-check-input" type="checkbox" [checked]="f.seleccionado" (change)="alternar(f.sku, $any($event.target).checked)" [attr.aria-label]="'Seleccionar ' + f.nombre" />
                  </td>
                  <td>
                    <div class="fw-semibold" style="font-size:.9rem">{{ f.nombre }}</div>
                    <div class="small text-tenue font-monospace">{{ f.sku }} · {{ f.categoria }}</div>
                  </td>
                  <td class="text-end fw-bold text-danger">{{ f.stock }}</td>
                  <td class="text-end text-suave">{{ f.minimo }}</td>
                  <td class="text-end pe-3 fw-bold text-primary">+{{ f.sugerido }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (orden()) {
        <div class="sv-card p-4">
          <div class="alert alert-success d-flex align-items-center gap-2 small mb-0" role="alert">
            <i class="bi bi-check-circle-fill"></i>
            <span>Orden de compra <b>{{ orden() }}</b> generada y enviada al distribuidor.</span>
          </div>
          <h3 class="font-archivo fw-bold fs-6 mt-4 mb-3">Seguimiento del pedido al distribuidor</h3>
          <div style="max-width:440px">
            <sv-stepper [pasos]="pasos"></sv-stepper>
          </div>
        </div>
      }
    </div>

    <sv-dialogo-confirmar
      [abierto]="pedirOC()"
      titulo="¿Generar orden de compra?"
      [mensaje]="'Se creará una orden por ' + seleccionados() + ' producto(s) seleccionado(s).'"
      textoConfirmar="Generar orden"
      textoCancelar="Cancelar"
      [peligro]="false"
      icono="bi-file-earmark-plus-fill"
      (confirmar)="generar()"
      (cancelar)="pedirOC.set(false)"
    ></sv-dialogo-confirmar>
  `,
})
export class Reposicion {
  private readonly inventario = inject(InventarioService);

  readonly filas = signal<FilaReposicion[]>(
    this.inventario.alertas().map((p) => ({
      sku: p.sku,
      nombre: p.nombre,
      categoria: p.categoria,
      stock: p.stock,
      minimo: p.minimo,
      // Cantidad sugerida para volver al doble del mínimo.
      sugerido: Math.max(p.minimo * 2 - p.stock, p.minimo),
      seleccionado: true,
    })),
  );

  readonly orden = signal('');
  readonly pedirOC = signal(false);

  // Progreso referencial de la orden hacia el distribuidor.
  readonly pasos: PasoStepper[] = [
    { titulo: 'Orden emitida', estado: 'Completado', tiempo: 'Hoy, 10:24 a. m.', situacion: 'ok' },
    { titulo: 'Confirmada por el distribuidor', estado: 'Completado', tiempo: 'Hoy, 11:05 a. m.', situacion: 'ok' },
    { titulo: 'En preparación', estado: 'En proceso', tiempo: 'Estimado: mañana', situacion: 'actual' },
    { titulo: 'En camino a tienda', estado: 'Pendiente', tiempo: 'Estimado: en 2 días', situacion: 'pendiente' },
    { titulo: 'Recepción en almacén', estado: 'Pendiente', situacion: 'pendiente' },
  ];

  readonly seleccionados = computed(() => this.filas().filter((f) => f.seleccionado).length);
  readonly todosMarcados = computed(() => this.filas().length > 0 && this.filas().every((f) => f.seleccionado));

  alternar(sku: string, valor: boolean): void {
    this.filas.update((fs) => fs.map((f) => (f.sku === sku ? { ...f, seleccionado: valor } : f)));
  }

  marcarTodos(valor: boolean): void {
    this.filas.update((fs) => fs.map((f) => ({ ...f, seleccionado: valor })));
  }

  generar(): void {
    if (!this.seleccionados()) return;
    this.orden.set('OC-' + Math.floor(1200 + this.seleccionados() * 31));
    this.pedirOC.set(false);
  }
}
