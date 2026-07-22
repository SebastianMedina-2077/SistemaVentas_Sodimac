import { Component, input } from '@angular/core';

export interface PasoStepper {
  titulo: string;
  estado: string;
  tiempo?: string;
  situacion: 'ok' | 'actual' | 'pendiente';
}

// Progreso por pasos (p. ej. estado de una orden de compra al distribuidor).
@Component({
  selector: 'sv-stepper',
  template: `
    @for (p of pasos(); track p.titulo; let i = $index) {
      <div
        class="sv-stepper-step"
        [class.sv-step-ok]="p.situacion === 'ok'"
        [class.sv-step-actual]="p.situacion === 'actual'"
        [class.sv-step-pend]="p.situacion === 'pendiente'"
      >
        <div class="sv-stepper-circle">
          @if (p.situacion === 'ok') { <i class="bi bi-check-lg"></i> } @else { {{ i + 1 }} }
        </div>
        <div class="sv-stepper-line"></div>
        <div class="flex-grow-1">
          <div class="sv-stepper-title">{{ p.titulo }}</div>
          <span class="sv-stepper-estado">{{ p.estado }}</span>
          @if (p.tiempo) { <div class="sv-stepper-time">{{ p.tiempo }}</div> }
        </div>
      </div>
    }
  `,
})
export class SvStepper {
  readonly pasos = input<PasoStepper[]>([]);
}
