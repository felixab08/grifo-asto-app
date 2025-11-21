// ...existing code...
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'regular'
})
export class RegularPipe implements PipeTransform {

  private static readonly DIAMETER_CM = 230;           // cm
  private static readonly LENGTH_CM = 273.34;          // cm
  private static readonly CM3_PER_GALLON = 3785.411784; // cm³ por galón (US)
  private static readonly MAX_GALLONS = 3000;

  transform(value: number): number {
    if (!isFinite(value) || value <= 0) return 0;

    const R = RegularPipe.DIAMETER_CM / 2;
    const h = Math.max(0, Math.min(value, RegularPipe.DIAMETER_CM));

    // Volumen total del cilindro (cm³) y su equivalente en galones
    const fullVolumeCm3 = Math.PI * R * R * RegularPipe.LENGTH_CM;
    const fullGallons = fullVolumeCm3 / RegularPipe.CM3_PER_GALLON;

    // Si el nivel alcanza o supera el diámetro, devolvemos la capacidad máxima
    if (h >= RegularPipe.DIAMETER_CM) return RegularPipe.MAX_GALLONS;

    // Volumen del segmento circular a altura h (cm³):
    // V(h) = L * [ R^2 * acos((R - h)/R) - (R - h) * sqrt(h*(2R - h)) ]
    const ratio = (R - h) / R;
    const clamped = Math.max(-1, Math.min(1, ratio));
    const theta = Math.acos(clamped);
    const segment = (R * R) * theta - (R - h) * Math.sqrt(Math.max(0, h * (2 * R - h)));
    const volumeCm3 = RegularPipe.LENGTH_CM * segment;
    const gallonsRaw = volumeCm3 / RegularPipe.CM3_PER_GALLON;

    // Escalar para que el volumen lleno corresponda a MAX_GALLONS, y limitar
    const scale = fullGallons > 0 ? RegularPipe.MAX_GALLONS / fullGallons : 1;
    const scaled = gallonsRaw * scale;
    const result = Math.min(scaled, RegularPipe.MAX_GALLONS);

    return Number(result.toFixed(2));
  }

}
// ...existing code...
