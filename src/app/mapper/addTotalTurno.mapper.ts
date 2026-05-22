import { Turno } from '@oil-store/model';

export const addTotalTurnoMapper = (data: Turno[]): Turno[] => {
  return data.map((turno) => ({
    ...turno,
    medidas: addTotalMedidas(
      addSubTotalMedidas(turno.medidas, turno.idTurno),
      turno.idTurno,
      turno.sum,
      turno.rest,
    ),
  }));
};

const addSubTotalMedidas = (medidas: any[], idTurno: number) => {
  // Calcular sumas de entrada y salida
  const totalEntrada = medidas.reduce((sum, medida) => sum + (medida.entrada || 0), 0);
  const totalSalida = medidas.reduce((sum, medida) => sum + (medida.salida || 0), 0);

  // Crear el objeto de subtotal
  const subTotalMedida = {
    idMedida: Math.random() * 100000, // ID único para el subtotal
    idTurno: idTurno,
    tipo: 'Subtotal',
    entrada: totalEntrada,
    salida: totalSalida,
    code: 'subtotal',
  };

  // Retornar medidas originales + subtotal
  return [...medidas, subTotalMedida];
};

const addTotalMedidas = (medidas: any[], idTurno: number, sum: number, rest: number) => {
  // Calcular sumas de entrada y salida
  const medidaSubtotal = medidas.find((m) => m.code === 'subtotal');
  const totalEntrada = medidaSubtotal.entrada || 0;
  const totalSalida = medidaSubtotal.salida || 0;
  let total = 0;
  if (totalEntrada !== 0 && totalSalida !== 0) {
    total = totalSalida - totalEntrada - rest + sum;
  }
  // Crear el objeto de subtotal
  const totalMedida = {
    idMedida: Math.random() * 100000, // ID único para el total
    idTurno: idTurno,
    tipo: 'Total',
    entrada: 0,
    salida: total,
    code: 'total',
  };

  // Retornar medidas originales + subtotal
  return [...medidas, totalMedida];
};
