import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRODUCTOS } from '../../nucleo/datos';
import { Producto } from '../../nucleo/modelos';
import { SolesPipe } from '../../nucleo/soles.pipe';
import { OpcionCombo, SvCombobox } from '../../nucleo/ui/combobox';
import { ToastService } from '../../nucleo/ui/toast.service';

interface LineaCotizacion {
  producto: Producto;
  cantidad: number;
}

const IGV = 0.18;

// Armado de cotizaciones para el asesor de ventas (sin afectar stock).
@Component({
  selector: 'app-cotizaciones',
  imports: [FormsModule, SolesPipe, SvCombobox],
  template: `
    <div class="row g-4 sv-anim">
      <div class="col-lg-7">
        <div class="sv-card p-3 mb-3">
          <sv-combobox
            etiqueta="Agregar producto a la cotización"
            placeholder="Nombre o SKU (ej. cemento, PIN-088)"
            [opciones]="opciones"
            (seleccion)="agregar($event.id)"
          ></sv-combobox>
        </div>

        <div class="sv-card p-0 overflow-hidden">
          @if (lineas().length) {
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr class="text-uppercase text-tenue small" style="background:#f5f7fa">
                    <th class="px-3 py-3 fw-semibold">Producto</th>
                    <th class="py-3 fw-semibold text-center">Cantidad</th>
                    <th class="py-3 fw-semibold text-end">Precio</th>
                    <th class="py-3 fw-semibold text-end pe-3">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  @for (l of lineas(); track l.producto.sku) {
                    <tr>
                      <td class="px-3">
                        <div class="fw-semibold" style="font-size:.9rem">{{ l.producto.nombre }}</div>
                        <div class="small text-tenue font-monospace">{{ l.producto.sku }}</div>
                      </td>
                      <td class="text-center">
                        <div class="d-inline-flex align-items-center gap-1">
                          <button type="button" class="btn btn-outline-secondary btn-sm px-2 py-0" (click)="dec(l.producto.sku)">−</button>
                          <span class="fw-bold" style="min-width:22px">{{ l.cantidad }}</span>
                          <button type="button" class="btn btn-outline-secondary btn-sm px-2 py-0" (click)="inc(l.producto.sku)">+</button>
                        </div>
                      </td>
                      <td class="text-end">{{ l.producto.precio | soles }}</td>
                      <td class="text-end pe-3 fw-bold">{{ l.producto.precio * l.cantidad | soles }}</td>
                      <td class="text-end pe-3">
                        <button type="button" class="btn btn-link text-danger p-0" (click)="quitar(l.producto.sku)" aria-label="Quitar">
                          <i class="bi bi-x-lg"></i>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="text-center p-5 text-suave">
              <i class="bi bi-file-earmark-text fs-1 d-block mb-2 text-tenue"></i>
              Agrega productos para armar la cotización del cliente.
            </div>
          }
        </div>
      </div>

      <div class="col-lg-5">
        <div class="sv-card p-4 sticky-top" style="top:16px">
          <h2 class="font-archivo fw-bold fs-6 mb-3">Datos del cliente</h2>
          <div class="mb-2">
            <label class="form-label small fw-semibold" for="cot-nombre">Nombre / razón social</label>
            <input id="cot-nombre" class="form-control" [(ngModel)]="clienteNombre" placeholder="Ej. Constructora Andina S.A.C." />
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold" for="cot-doc">DNI / RUC</label>
            <input id="cot-doc" class="form-control" [(ngModel)]="clienteDoc" inputmode="numeric" placeholder="20123456789" />
          </div>

          <div class="border-top pt-3 d-flex flex-column gap-1">
            <div class="d-flex justify-content-between text-suave small">Subtotal<span>{{ totales().subtotal | soles }}</span></div>
            <div class="d-flex justify-content-between text-suave small">IGV (18%)<span>{{ totales().igv | soles }}</span></div>
            <div class="d-flex justify-content-between font-archivo fw-bold fs-5">Total<span>{{ totales().total | soles }}</span></div>
          </div>

          @if (numero()) {
            <div class="alert alert-success d-flex align-items-center gap-2 py-2 small mt-3 mb-0" role="alert">
              <i class="bi bi-check-circle-fill"></i>
              <span>Cotización <b>{{ numero() }}</b> generada. Válida por 15 días.</span>
            </div>
            <button type="button" class="btn btn-outline-secondary w-100 mt-3" (click)="nueva()">Nueva cotización</button>
          } @else {
            <button type="button" class="btn btn-primary w-100 py-2 mt-3" [disabled]="!lineas().length" (click)="generar()">
              <i class="bi bi-file-earmark-check me-1"></i> Generar cotización
            </button>
          }
        </div>
      </div>
    </div>
  `,
})
export class Cotizaciones {
  readonly opciones: OpcionCombo[] = PRODUCTOS.map((p) => ({
    id: p.sku,
    etiqueta: p.nombre,
    sub: `${p.sku} · ${new SolesPipe().transform(p.precio)}`,
    imagen: p.imagen,
  }));

  readonly lineas = signal<LineaCotizacion[]>([]);
  readonly clienteNombre = signal('');
  readonly clienteDoc = signal('');
  readonly numero = signal('');

  readonly totales = computed(() => {
    const total = this.lineas().reduce((a, l) => a + l.producto.precio * l.cantidad, 0);
    const subtotal = total / (1 + IGV);
    return { total, subtotal, igv: total - subtotal };
  });

  agregar(sku: string): void {
    const p = PRODUCTOS.find((x) => x.sku === sku);
    if (!p) return;
    this.numero.set('');
    this.lineas.update((ls) => {
      const item = ls.find((l) => l.producto.sku === sku);
      if (item) return ls.map((l) => (l.producto.sku === sku ? { ...l, cantidad: l.cantidad + 1 } : l));
      return [...ls, { producto: p, cantidad: 1 }];
    });
  }

  inc(sku: string): void {
    this.lineas.update((ls) => ls.map((l) => (l.producto.sku === sku ? { ...l, cantidad: l.cantidad + 1 } : l)));
  }

  dec(sku: string): void {
    this.lineas.update((ls) =>
      ls
        .map((l) => (l.producto.sku === sku ? { ...l, cantidad: l.cantidad - 1 } : l))
        .filter((l) => l.cantidad > 0),
    );
  }

  quitar(sku: string): void {
    this.lineas.update((ls) => ls.filter((l) => l.producto.sku !== sku));
  }

  private readonly toast = inject(ToastService);

  generar(): void {
    if (!this.lineas().length) return;
    const numero = 'COT-' + Math.floor(10000 + this.lineas().length * 137);
    this.numero.set(numero);
    this.toast.mostrar('Cotización generada', `${numero} · válida por 15 días.`);
  }

  nueva(): void {
    this.lineas.set([]);
    this.clienteNombre.set('');
    this.clienteDoc.set('');
    this.numero.set('');
  }
}
