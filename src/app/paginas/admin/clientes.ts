import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolesPipe } from '../../nucleo/soles.pipe';
import { ToastService } from '../../nucleo/ui/toast.service';

interface ClienteFila {
  tipoDoc: 'DNI' | 'RUC';
  doc: string;
  nombre: string;
  distrito: string;
  compras: number;
  cmr: boolean;
}

// Directorio de clientes (gerente): consulta y alta rápida.
@Component({
  selector: 'app-clientes',
  imports: [FormsModule, SolesPipe],
  template: `
    <div class="row g-4 sv-anim">
      <div class="col-lg-8">
        <div class="sv-card p-3 mb-3">
          <div class="position-relative">
            <i class="bi bi-search position-absolute text-tenue" style="left:14px;top:10px"></i>
            <input
              type="search"
              class="form-control ps-5"
              [value]="filtro()"
              (input)="filtro.set($any($event.target).value)"
              placeholder="Buscar por nombre, documento o distrito"
              aria-label="Buscar cliente"
            />
          </div>
        </div>

        <div class="sv-card p-0 overflow-hidden">
          <div class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr class="text-uppercase text-tenue small" style="background:#f5f7fa">
                  <th class="px-3 py-2 fw-semibold">Cliente</th>
                  <th class="py-2 fw-semibold">Documento</th>
                  <th class="py-2 fw-semibold">Distrito</th>
                  <th class="py-2 fw-semibold text-end pe-3">Compras</th>
                </tr>
              </thead>
              <tbody>
                @for (c of filtrados(); track c.doc) {
                  <tr>
                    <td class="px-3">
                      <div class="fw-semibold" style="font-size:.9rem">{{ c.nombre }}</div>
                      @if (c.cmr) { <span class="badge rounded-pill bg-danger-subtle text-danger" style="font-size:.65rem"><i class="bi bi-credit-card-2-front me-1"></i>CMR Falabella</span> }
                    </td>
                    <td class="small"><span class="badge rounded-1 bg-body-secondary text-dark me-1">{{ c.tipoDoc }}</span><span class="font-monospace">{{ c.doc }}</span></td>
                    <td class="small text-suave">{{ c.distrito }}</td>
                    <td class="text-end pe-3 fw-bold">{{ c.compras | soles }}</td>
                  </tr>
                } @empty {
                  <tr><td colspan="4" class="text-center text-suave p-4">Sin clientes que coincidan con «{{ filtro() }}».</td></tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="sv-card p-4">
          <h2 class="font-archivo fw-bold fs-6 mb-3">Nuevo cliente</h2>
          <div class="mb-2">
            <label class="form-label small fw-semibold" for="cl-nombre">Nombre / razón social</label>
            <input id="cl-nombre" class="form-control" [(ngModel)]="nombre" placeholder="Nombre completo" />
          </div>
          <div class="row g-2 mb-2">
            <div class="col-5">
              <label class="form-label small fw-semibold" for="cl-tipo">Tipo</label>
              <select id="cl-tipo" class="form-select" [(ngModel)]="tipoDoc">
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
              </select>
            </div>
            <div class="col-7">
              <label class="form-label small fw-semibold" for="cl-doc">Documento</label>
              <input id="cl-doc" class="form-control" [(ngModel)]="doc" inputmode="numeric" placeholder="Número" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label small fw-semibold" for="cl-dist">Distrito</label>
            <input id="cl-dist" class="form-control" [(ngModel)]="distrito" placeholder="Ej. Los Olivos" />
          </div>
          <button type="button" class="btn btn-primary w-100" [disabled]="!nombre().trim() || !doc().trim()" (click)="agregar()">
            <i class="bi bi-person-plus me-1"></i> Registrar cliente
          </button>
        </div>
      </div>
    </div>
  `,
})
export class Clientes {
  readonly filtro = signal('');
  readonly nombre = signal('');
  readonly tipoDoc = signal<'DNI' | 'RUC'>('DNI');
  readonly doc = signal('');
  readonly distrito = signal('');

  readonly clientes = signal<ClienteFila[]>([
    { tipoDoc: 'RUC', doc: '20512345671', nombre: 'Constructora Andina S.A.C.', distrito: 'San Isidro', compras: 18450.9, cmr: true },
    { tipoDoc: 'DNI', doc: '45678912', nombre: 'María Fernández Rojas', distrito: 'Los Olivos', compras: 1290.5, cmr: false },
    { tipoDoc: 'DNI', doc: '09871234', nombre: 'Jorge Quispe Mamani', distrito: 'Comas', compras: 640.0, cmr: true },
    { tipoDoc: 'RUC', doc: '20487654321', nombre: 'Servicios Eléctricos del Norte E.I.R.L.', distrito: 'Independencia', compras: 7830.0, cmr: false },
    { tipoDoc: 'DNI', doc: '41236589', nombre: 'Rosa Huamán Vega', distrito: 'San Martín de Porres', compras: 312.9, cmr: false },
  ]);

  readonly filtrados = computed(() => {
    const q = this.filtro().trim().toLowerCase();
    if (!q) return this.clientes();
    return this.clientes().filter((c) => `${c.nombre} ${c.doc} ${c.distrito}`.toLowerCase().includes(q));
  });

  private readonly toast = inject(ToastService);

  agregar(): void {
    if (!this.nombre().trim() || !this.doc().trim()) return;
    const nombre = this.nombre().trim();
    this.clientes.update((cs) => [
      { tipoDoc: this.tipoDoc(), doc: this.doc().trim(), nombre, distrito: this.distrito().trim() || '—', compras: 0, cmr: false },
      ...cs,
    ]);
    this.toast.mostrar('Cliente registrado', nombre);
    this.nombre.set('');
    this.doc.set('');
    this.distrito.set('');
  }
}
