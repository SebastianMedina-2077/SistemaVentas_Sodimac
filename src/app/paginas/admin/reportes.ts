import { Component, signal } from '@angular/core';
import { DETALLE_CATEGORIAS, VENTAS_MENSUALES } from '../../nucleo/reportes';
import { SolesPipe } from '../../nucleo/soles.pipe';

@Component({
  selector: 'app-reportes',
  imports: [SolesPipe],
  templateUrl: './reportes.html',
})
export class Reportes {
  readonly meses = VENTAS_MENSUALES;
  readonly detalle = DETALLE_CATEGORIAS;

  readonly pestanas = ['Por categoría', 'Por turno', 'Por formato'];
  readonly pestana = signal('Por categoría');

  readonly aviso = signal('');

  exportar(formato: 'PDF' | 'Excel'): void {
    // Mock: en producción generaría el archivo (CUS-06).
    this.aviso.set(`Reporte "${this.pestana()}" exportado en formato ${formato}.`);
  }
}
