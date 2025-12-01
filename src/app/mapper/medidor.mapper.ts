export const createMedidaMapper = (data: any, idTurno: number, type: string, anterior?: any) => {
  if (type === 'iniciar') {
    return [
      { entrada: +data.pet11, tipo: 'Petroleo', turno: { idTurno: idTurno } },
      { entrada: +data.pet21, tipo: 'Petroleo', turno: { idTurno: idTurno } },
      { entrada: +data.reg12, tipo: 'Regular', turno: { idTurno: idTurno } },
      { entrada: +data.reg22, tipo: 'Regular', turno: { idTurno: idTurno } },
      { entrada: +data.pri13, tipo: 'Primiun', turno: { idTurno: idTurno } },
      { entrada: +data.pri23, tipo: 'Primiun', turno: { idTurno: idTurno } },
    ];
  }
  if (type === 'cerrar' && anterior) {
    return [
      { idMedida: anterior[0].idMedida, entrada: anterior[0].entrada, salida: +data.pet11 },
      { idMedida: anterior[1].idMedida, entrada: anterior[1].entrada, salida: +data.pet21 },
      { idMedida: anterior[2].idMedida, entrada: anterior[2].entrada, salida: +data.reg12 },
      { idMedida: anterior[3].idMedida, entrada: anterior[3].entrada, salida: +data.reg22 },
      { idMedida: anterior[4].idMedida, entrada: anterior[4].entrada, salida: +data.pri13 },
      { idMedida: anterior[5].idMedida, entrada: anterior[5].entrada, salida: +data.pri23 },
    ];
  }
  return data;
};
