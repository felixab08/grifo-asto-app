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
    return {
      datos: [
        { idMedida: anterior.datos[0].idMedida, salida: +data.pet11 },
        { idMedida: anterior.datos[1].idMedida, salida: +data.pet21 },
        { idMedida: anterior.datos[2].idMedida, salida: +data.reg12 },
        { idMedida: anterior.datos[3].idMedida, salida: +data.reg22 },
        { idMedida: anterior.datos[4].idMedida, salida: +data.pri13 },
        { idMedida: anterior.datos[5].idMedida, salida: +data.pri23 },
      ],
      observaciones: data.obs || '',
    };
  }
  return data;
};
