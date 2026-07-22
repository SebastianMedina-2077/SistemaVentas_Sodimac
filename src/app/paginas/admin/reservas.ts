import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRODUCTOS } from '../../nucleo/datos';
import { OpcionCombo, SvCombobox } from '../../nucleo/ui/combobox';
import { ToastService } from '../../nucleo/ui/toast.service';

interface Reserva {
  codigo: string;
  producto: string;
  cliente: string;
  tienda: string;
  cantidad: number;
  plazo: string;
}

// Reservas Click & Collect del asesor (CUS-03).
@Component({
  selector: 'app-reservas',
  imports: [FormsModule, SvCombobox],
  template: `
    <div class="row g-4 sv-anim">
      <div class="col-lg-5">
        <div class="sv-card p-4">
          <h2 class="font-archivo fw-bold fs-6 mb-3">Nueva reserva</h2>

          <div class="mb-3">
            <sv-combobox
              etiqueta="Producto"
              placeholder="Nombre o SKU"
              [opciones]="opciones"
              (seleccion)="prodSel.set($event.etiqueta)"
            ></sv-combobox>
          </div>
          <div class="mb-2">
            <label class="form-label small fw-semibold" for="r-cli">Cliente</label>
            <input id="r-cli" class="form-control" [(ngModel)]="cliente" placeholder="Nombre del cliente" />
          </div>
          <div class="row g-2 mb-3">
            <div class="col-7">
              <label class="form-label small fw-semibold" for="r-tienda">Tienda de retiro</label>
              <select id="r-tienda" class="form-select" [(ngModel)]="tienda">
                @for (t of tiendas; track t) { <option [value]="t">{{ t }}</option> }
              </select>
            </div>
            <div class="col-5">
              <label class="form-label small fw-semibold" for="r-cant">Cantidad</label>
              <input id="r-cant" type="number" min="1" class="form-control" [(ngModel)]="cantidad" />
            </div>
          </div>

          <button type="button" class="btn btn-primary w-100" [disabled]="!prodSel() || !cliente().trim()" (click)="crear()">
            <i class="bi bi-bookmark-check me-1"></i> Reservar y bloquear stock
          </button>

          @if (ultima()) {
            <div class="alert alert-success d-flex align-items-center gap-2 py-2 small mt-3 mb-0" role="alert">
              <i class="bi bi-check-circle-fill"></i>
              <span>Reserva <b>{{ ultima() }}</b> creada. Se envió el código de retiro al cliente.</span>
            </div>
          }
        </div>
      </div>

      <div class="col-lg-7">
        <div class="sv-card p-0 overflow-hidden">
          <div class="p-3 border-bottom fw-semibold small text-uppercase text-tenue" style="letter-spacing:.05em">
            Reservas activas ({{ reservas().length }})
          </div>
          @if (reservas().length) {
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr class="text-uppercase text-tenue small" style="background:#f5f7fa">
                    <th class="px-3 py-2 fw-semibold">Código</th>
                    <th class="py-2 fw-semibold">Producto</th>
                    <th class="py-2 fw-semibold">Cliente</th>
                    <th class="py-2 fw-semibold">Retiro</th>
                    <th class="py-2 fw-semibold text-center">Cant.</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of reservas(); track r.codigo) {
                    <tr>
                      <td class="px-3 font-monospace fw-semibold text-primary">{{ r.codigo }}</td>
                      <td style="font-size:.88rem">{{ r.producto }}</td>
                      <td class="small">{{ r.cliente }}</td>
                      <td class="small text-suave">{{ r.tienda }}<div class="text-tenue" style="font-size:.72rem">Vence {{ r.plazo }}</div></td>
                      <td class="text-center fw-bold">{{ r.cantidad }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="text-center p-5 text-suave">
              <i class="bi bi-bookmark fs-1 d-block mb-2 text-tenue"></i>
              Aún no hay reservas registradas.
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class Reservas {
  readonly opciones: OpcionCombo[] = PRODUCTOS.map((p) => ({ id: p.sku, etiqueta: p.nombre, sub: p.sku, imagen: p.imagen }));
  readonly tiendas = ['Homecenter Lima Norte', 'Homecenter San Isidro', 'Homecenter Atocongo'];

  readonly prodSel = signal('');
  readonly cliente = signal('');
  readonly tienda = signal('Homecenter Lima Norte');
  readonly cantidad = signal(1);
  readonly reservas = signal<Reserva[]>([]);
  readonly ultima = signal('');
  private readonly toast = inject(ToastService);

  crear(): void {
    if (!this.prodSel() || !this.cliente().trim()) return;
    const codigo = 'RES-' + Math.floor(1000 + this.reservas().length * 53 + 47);
    // Plazo de retiro: 3 días hábiles (referencial en el prototipo).
    const reserva: Reserva = {
      codigo,
      producto: this.prodSel(),
      cliente: this.cliente().trim(),
      tienda: this.tienda(),
      cantidad: Math.max(1, this.cantidad()),
      plazo: 'en 3 días',
    };
    this.reservas.update((rs) => [reserva, ...rs]);
    this.ultima.set(codigo);
    this.toast.mostrar('Reserva creada', `${codigo} · código de retiro enviado al cliente.`);
    this.prodSel.set('');
    this.cliente.set('');
    this.cantidad.set(1);
  }
}
