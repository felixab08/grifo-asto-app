import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({ name: 'corte' })
export class CortePipe implements PipeTransform {
  transform(value: number, fractionDigits: number = 2): string {
    if (value == null) return '';
    const [integer, decimal] = value.toFixed(fractionDigits).split('.');
    const integerWithSpaces = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return decimal
      ? `${integerWithSpaces}.${decimal}`
      : `${integerWithSpaces}`;
  }
}
