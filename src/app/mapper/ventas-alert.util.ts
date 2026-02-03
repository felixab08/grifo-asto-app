import { TipoVentaContent } from '@oil-store/model';
import { VentasContent } from '../oil-store/model/detalle-ventas.interface';

export type AlertColor = 'red' | 'yellow' | 'green';

export interface VentasAlert {
  type: 'Petroleo' | 'Regular' | 'Premiun';
  cantidad: number;
  consumido: number;
  resto: number;
  color: AlertColor;
}

const CRITICAL_THRESHOLD = 5; // rojo
const WARNING_THRESHOLD = 10; // amarillo

/**
 * Genera alertas por tipo de venta a partir de las ventas y los límites configurados.
 * Calcula totales en una sola pasada y devuelve solo tipos con cantidad configurada (>0).
 */
export const generateAlert = (
  ventas: VentasContent[],
  tipoventa: TipoVentaContent,
): VentasAlert[] => {
  // calcular totales en una sola pasada para evitar múltiples reducciones
  type FuelKey = 'diesel' | 'regular' | 'premiun';

  const totals = ventas.reduce<Record<FuelKey, number>>(
    (acc, v) => {
      acc.diesel += Number(v.diesel || 0);
      acc.regular += Number(v.regular || 0);
      acc.premiun += Number(v.premiun || 0);
      return acc;
    },
    { diesel: 0, regular: 0, premiun: 0 },
  );

  const types: Array<{ key: FuelKey; label: VentasAlert['type'] }> = [
    { key: 'diesel', label: 'Petroleo' },
    { key: 'regular', label: 'Regular' },
    { key: 'premiun', label: 'Premiun' },
  ];

  return types
    .map(({ key, label }) => {
      const configured = Number(tipoventa[key] ?? 0);
      if (!configured || configured <= 0) return null;

      const consumido = totals[key] ?? 0;
      const resto = Math.max(configured - consumido, 0);

      return {
        type: label,
        cantidad: configured,
        consumido,
        resto,
        color: getColorByRemaining(resto),
      } as VentasAlert;
    })
    .filter((x): x is VentasAlert => x !== null);
};

const getColorByRemaining = (cant: number): AlertColor => {
  if (cant <= CRITICAL_THRESHOLD) return 'red';
  if (cant <= WARNING_THRESHOLD) return 'yellow';
  return 'green';
};
