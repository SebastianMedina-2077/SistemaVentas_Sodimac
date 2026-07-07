import { Pipe, PipeTransform } from '@angular/core';

/** Formatea un número como moneda peruana: 1234.5 → "S/ 1,234.50". */
@Pipe({ name: 'soles', standalone: true })
export class SolesPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    const n = valor ?? 0;
    return 'S/ ' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
