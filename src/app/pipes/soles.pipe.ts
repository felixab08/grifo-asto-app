import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({ name: 'soles' })
export class SolesPipe implements PipeTransform {
  transform(value: number, fractionDigits: number = 2): string {
    if (value == null) return '';
    // Formatear el número con espacios cada 3 dígitos
    const [integer, decimal] = value.toFixed(fractionDigits).split('.');
    const integerWithSpaces = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return decimal
      ? `S/. ${integerWithSpaces}.${decimal}`
      : `S/. ${integerWithSpaces}`;
  }
}
