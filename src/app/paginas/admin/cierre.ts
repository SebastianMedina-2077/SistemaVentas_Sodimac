import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SolesPipe } from '../../nucleo/soles.pipe';
import { SvDialogoConfirmar } from '../../nucleo/ui/dialogo-confirmar';

// Cierre de caja del cajero: arqueo del efectivo del turno.
@Component({
  selector: 'app-cierre',
  imports: [FormsModule, SolesPipe, SvDialogoConfirmar],
  template: `
    <div class="row g-4 sv-anim" style="max-width:920px">
      <div class="col-md-7">
        <div class="row g-3 mb-3">
          <div class="col-6 col-sm-4">
            <div class="sv-card p-3 h-100">
              <div class="text-uppercase text-tenue fw-semibold" style="font-size:.65rem">Tickets del turno</div>
              <div class="sv-kpi-valor">{{ tickets }}</div>
            </div>
          </div>
          <div class="col-6 col-sm-4">
            <div class="sv-card p-3 h-100">
              <div class="text-uppercase text-tenue fw-semibold" style="font-size:.65rem">Ventas del turno</div>
              <div class="sv-kpi-valor">{{ totalTurno | soles }}</div>
            </div>
          </div>
          <div class="col-12 col-sm-4">
            <div class="sv-card p-3 h-100">
              <div class="text-uppercase text-tenue fw-semibold" style="font-size:.65rem">Efectivo esperado</div>
              <div class="sv-kpi-valor text-primary">{{ efectivoEsperado | soles }}</div>
            </div>
          </div>
        </div>

        <div class="sv-card p-4">
          <h2 class="font-archivo fw-bold fs-6 mb-1">Arqueo de caja</h2>
          <p class="text-suave small mb-3">Cuenta el efectivo físico en caja y regístralo para cerrar el turno.</p>

          <div class="row g-3 align-items-end">
            <div class="col-sm-6">
              <label class="form-label small fw-semibold" for="c-contado">Efectivo contado (S/)</label>
              <input id="c-contado" type="number" min="0" step="0.10" class="form-control form-control-lg" [(ngModel)]="contado" />
            </div>
            <div class="col-sm-6">
              <div class="p-3 rounded-3" [class.bg-success-subtle]="diferencia() === 0" [class.bg-danger-subtle]="diferencia() !== 0">
                <div class="small text-suave">Diferencia</div>
                <div class="fw-bold fs-5" [class.text-success]="diferencia() === 0" [class.text-danger]="diferencia() !== 0">
                  {{ diferencia() | soles }}
                  <span class="small fw-normal">{{ diferencia() === 0 ? '· cuadra' : (diferencia() > 0 ? '· sobra' : '· falta') }}</span>
                </div>
              </div>
            </div>
          </div>

          <button type="button" class="btn btn-primary mt-4" [disabled]="cerrado()" (click)="pedirCierre.set(true)">
            <i class="bi bi-lock me-1"></i> Cerrar caja del turno
          </button>

          @if (cerrado()) {
            <div class="alert alert-success d-flex align-items-center gap-2 py-2 small mt-3 mb-0" role="alert">
              <i class="bi bi-check-circle-fill"></i>
              <span>Caja cerrada. Se generó el reporte de cierre del turno.</span>
            </div>
          }
        </div>
      </div>

      <div class="col-md-5">
        <div class="sv-card p-4">
          <h2 class="font-archivo fw-bold fs-6 mb-3">Detalle por método</h2>
          <div class="d-flex flex-column gap-2">
            <div class="d-flex justify-content-between"><span class="text-suave"><i class="bi bi-cash me-2 text-success"></i>Efectivo</span><b>{{ efectivoEsperado | soles }}</b></div>
            <div class="d-flex justify-content-between"><span class="text-suave"><i class="bi bi-credit-card me-2 text-primary"></i>Tarjeta</span><b>{{ tarjeta | soles }}</b></div>
            <div class="d-flex justify-content-between"><span class="text-suave"><i class="bi bi-wallet2 me-2 text-danger"></i>CMR Falabella</span><b>{{ cmr | soles }}</b></div>
            <div class="border-top pt-2 mt-1 d-flex justify-content-between font-archivo fw-bold"><span>Total</span><span>{{ totalTurno | soles }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <sv-dialogo-confirmar
      [abierto]="pedirCierre()"
      titulo="¿Cerrar la caja del turno?"
      mensaje="Se registrará el arqueo y no podrás seguir registrando ventas en este turno."
      textoConfirmar="Sí, cerrar caja"
      textoCancelar="Cancelar"
      [peligro]="false"
      icono="bi-lock-fill"
      (confirmar)="cerrar()"
      (cancelar)="pedirCierre.set(false)"
    ></sv-dialogo-confirmar>
  `,
})
export class Cierre {
  // Cifras del turno (mock; en producción vendrían de las ventas registradas).
  readonly tickets = 37;
  readonly efectivoEsperado = 2840.5;
  readonly tarjeta = 4120.0;
  readonly cmr = 1680.0;
  readonly totalTurno = this.efectivoEsperado + this.tarjeta + this.cmr;

  readonly contado = signal(0);
  readonly cerrado = signal(false);
  readonly pedirCierre = signal(false);

  readonly diferencia = computed(() => +(this.contado() - this.efectivoEsperado).toFixed(2));

  cerrar(): void {
    this.cerrado.set(true);
    this.pedirCierre.set(false);
  }
}
