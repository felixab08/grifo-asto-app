// ...existing code...
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'premium'
})
export class PremiumPipe implements PipeTransform {

  // Dimensiones del cilindro (cm) y constantes
  private static readonly DIAMETER_CM = 230;      // diámetro total del cilindro en cm
  private static readonly LENGTH_CM = 91.12;     // longitud del cilindro en cm
  private static readonly CM3_PER_GALLON = 3785.411784; // cm³ por galón (US)
  private static readonly MAX_GALLONS = 1000;

  transform(value: number): number {
    if (!isFinite(value) || value <= 0) return 0;

    const R = PremiumPipe.DIAMETER_CM / 2;
    const h = Math.min(value, PremiumPipe.DIAMETER_CM);

    // Si está lleno o el nivel >= diámetro devolvemos la capacidad máxima
    if (h >= PremiumPipe.DIAMETER_CM) return PremiumPipe.MAX_GALLONS;

    // Fórmula del volumen de un cilindro parcial (llenado hasta altura h):
    // V(h) = L * [ R^2 * acos((R - h)/R) - (R - h) * sqrt(h*(2R - h)) ]
    // Resultado en cm³, luego convertimos a galones.
    const ratio = (R - h) / R;
    const clamped = Math.max(-1, Math.min(1, ratio)); // evitar NaN por errores numéricos
    const theta = Math.acos(clamped);
    const segment = (R * R) * theta - (R - h) * Math.sqrt(Math.max(0, h * (2 * R - h)));
    const volumeCm3 = PremiumPipe.LENGTH_CM * segment;
    const gallons = volumeCm3 / PremiumPipe.CM3_PER_GALLON;

    // limitar al máximo y devolver con 2 decimales
    const result = Math.min(gallons, PremiumPipe.MAX_GALLONS);
    return Number(result.toFixed(2));
  }

}
// ...existing code...
