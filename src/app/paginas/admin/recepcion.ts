import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRODUCTOS } from '../../nucleo/datos';
import { OpcionCombo, SvCombobox } from '../../nucleo/ui/combobox';
import { ToastService } from '../../nucleo/ui/toast.service';

interface ItemRecepcion {
  guia: string;
  producto: string;
  cantidad: number;
  proveedor: string;
  oc: string;
}

// Recepción de mercadería del almacén (entrada de stock desde proveedor).
@Component({
  selector: 'app-recepcion',
  imports: [FormsModule, SvCombobox],
  template: `
    <div class="row g-4 sv-anim">
      <div class="col-lg-5">
        <div class="sv-card p-4">
          <h2 class="font-archivo fw-bold fs-6 mb-3">Registrar recepción</h2>

          <div class="mb-3">
            <sv-combobox etiqueta="Producto recibido" placeholder="Nombre o SKU" [opciones]="opciones" (seleccion)="prodSel.set($event.etiqueta)"></sv-combobox>
          </div>
          <div class="row g-2 mb-2">
            <div class="col-6">
              <label class="form-label small fw-semibold" for="re-cant">Cantidad</label>
              <input id="re-cant" type="number" min="1" class="form-control" [(ngModel)]="cantidad" />
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold" for="re-oc">N.º orden de compra</label>
              <input id="re-oc" class="form-control" [(ngModel)]="oc" placeholder="OC-1204" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold" for="re-prov">Proveedor</label>
            <input id="re-prov" class="form-control" [(ngModel)]="proveedor" placeholder="Ej. Bosch Perú S.A." />
          </div>

          <button type="button" class="btn btn-ink w-100" [disabled]="!prodSel() || cantidad() < 1" (click)="registrar()">
            <i class="bi bi-box-arrow-in-down me-1"></i> Ingresar al almacén
          </button>

          @if (ultima()) {
            <div class="alert alert-success d-flex align-items-center gap-2 py-2 small mt-3 mb-0" role="alert">
              <i class="bi bi-check-circle-fill"></i>
              <span>Recepción <b>{{ ultima() }}</b> registrada. Stock actualizado.</span>
            </div>
          }
        </div>
      </div>

      <div class="col-lg-7">
        <div class="sv-card p-0 overflow-hidden">
          <div class="p-3 border-bottom fw-semibold small text-uppercase text-tenue" style="letter-spacing:.05em">
            Recepciones del día ({{ recepciones().length }})
          </div>
          @if (recepciones().length) {
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr class="text-uppercase text-tenue small" style="background:#f5f7fa">
                    <th class="px-3 py-2 fw-semibold">Guía</th>
                    <th class="py-2 fw-semibold">Producto</th>
                    <th class="py-2 fw-semibold">Proveedor</th>
                    <th class="py-2 fw-semibold text-center">OC</th>
                    <th class="py-2 fw-semibold text-end pe-3">Cant.</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of recepciones(); track r.guia) {
                    <tr>
                      <td class="px-3 font-monospace fw-semibold text-primary">{{ r.guia }}</td>
                      <td style="font-size:.88rem">{{ r.producto }}</td>
                      <td class="small text-suave">{{ r.proveedor || '—' }}</td>
                      <td class="text-center small font-monospace">{{ r.oc || '—' }}</td>
                      <td class="text-end pe-3 fw-bold text-success">+{{ r.cantidad }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="text-center p-5 text-suave">
              <i class="bi bi-inboxes fs-1 d-block mb-2 text-tenue"></i>
              Todavía no se registran recepciones hoy.
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class Recepcion {
  readonly opciones: OpcionCombo[] = PRODUCTOS.map((p) => ({ id: p.sku, etiqueta: p.nombre, sub: p.sku, imagen: p.imagen }));

  readonly prodSel = signal('');
  readonly cantidad = signal(1);
  readonly proveedor = signal('');
  readonly oc = signal('');
  readonly recepciones = signal<ItemRecepcion[]>([]);
  readonly ultima = signal('');
  private readonly toast = inject(ToastService);

  registrar(): void {
    if (!this.prodSel() || this.cantidad() < 1) return;
    const guia = 'G-' + Math.floor(5000 + this.recepciones().length * 29 + 13);
    this.recepciones.update((rs) => [
      { guia, producto: this.prodSel(), cantidad: this.cantidad(), proveedor: this.proveedor().trim(), oc: this.oc().trim() },
      ...rs,
    ]);
    this.ultima.set(guia);
    this.toast.mostrar('Recepción registrada', `Guía ${guia} · stock de almacén actualizado.`);
    this.prodSel.set('');
    this.cantidad.set(1);
    this.proveedor.set('');
    this.oc.set('');
  }
}
