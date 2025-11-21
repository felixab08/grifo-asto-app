import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diesel'
})
export class DieselPipe implements PipeTransform {

  private static readonly DIAMETER_CM = 230;           // cm
  private static readonly LENGTH_CM = 264.45;          // cm (actualizado)
  private static readonly CM3_PER_GALLON = 3785.411784; // cm³ por galón (US)
  private static readonly MAX_GALLONS = 4000;          // capacidad máxima deseada

  transform(value: number): number {
    if (!isFinite(value) || value <= 0) return 0;

    const R = DieselPipe.DIAMETER_CM / 2;
    const h = Math.max(0, Math.min(value, DieselPipe.DIAMETER_CM));

    // Si el nivel alcanza o supera el diámetro completo -> capacidad máxima
    if (h >= DieselPipe.DIAMETER_CM) return DieselPipe.MAX_GALLONS;

    // Volumen del segmento circular (cm³):
    // V(h) = L * [ R^2 * acos((R - h)/R) - (R - h) * sqrt(h*(2R - h)) ]
    const ratio = (R - h) / R;
    const clamped = Math.max(-1, Math.min(1, ratio));
    const theta = Math.acos(clamped);
    const segment = (R * R) * theta - (R - h) * Math.sqrt(Math.max(0, h * (2 * R - h)));
    const volumeCm3 = DieselPipe.LENGTH_CM * segment;
    const gallonsRaw = volumeCm3 / DieselPipe.CM3_PER_GALLON;

    // Calcular factor de escala para que el volumen completo corresponda a MAX_GALLONS
    const fullVolumeCm3 = Math.PI * R * R * DieselPipe.LENGTH_CM;
    const fullGallons = fullVolumeCm3 / DieselPipe.CM3_PER_GALLON;
    const scale = fullGallons > 0 ? DieselPipe.MAX_GALLONS / fullGallons : 1;

    const scaled = gallonsRaw * scale;
    const result = Math.min(scaled, DieselPipe.MAX_GALLONS);

    return Number(result.toFixed(2));
  }
}
