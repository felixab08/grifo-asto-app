export const CloseAttentionMock = [
  {
    id_turno: 1,
    nombre: 'Felix ASTO',
    fecha_entrada: '2025-11-15T16:00:00Z',
    fecha_salida: '2025-11-16T16:00:00Z',
    lista_medidas: [
      { id_turno: 1, id: 'pet11', name: 'Petroleo', entrada: 10000, salida: 10100 },
      { id_turno: 1, id: 'pet21', name: 'Petroleo', entrada: 10010, salida: 10100 },
      { id_turno: 1, id: 'reg12', name: 'Regular', entrada: 10000, salida: 10100 },
      { id_turno: 1, id: 'reg22', name: 'Regular', entrada: 10500, salida: 12100 },
      { id_turno: 1, id: 'pri13', name: 'Primiun', entrada: 10800, salida: 12100 },
      { id_turno: 1, id: 'pri23', name: 'Primiun', entrada: 10700, salida: 11100 },
    ],
    observaciones: '100 a la Sra. Marta, 50 a Juanito, 200 a Nono.',
  },
  {
    id_turno: 2,
    nombre: 'Juan Pérez',
    fecha_entrada: '2025-11-15T16:00:00Z',
    fecha_salida: '2025-11-16T16:00:00Z',
    lista_medidas: [
      { id: 'pet11', name: 'Petroleo', entrada: 10000, salida: 10100 },
      { id: 'pet21', name: 'Petroleo', entrada: 10010, salida: 10100 },
      { id: 'reg12', name: 'Regular', entrada: 10000, salida: 10100 },
      { id: 'reg22', name: 'regular', entrada: 10500, salida: 11100 },
      { id: 'pri13', name: 'Primiun', entrada: 10800, salida: 11200 },
      { id: 'pri23', name: 'Primiun', entrada: 10700, salida: 11100 },
    ],
    observaciones: '200 a Nono, 50 Yape',
  },
];

export const AttentionMock = {
  messaje: 'Lista de cierres de atencion de una persona',
  status: 200,
  data: [
    {
      idPersona: 1,
      nombre: 'Felix',
      apellido: 'ASTO BERROCAL',
      turnos: [
        {
          idTurno: 1,
          fecha_entrada: '2025-11-15T16:00:00Z',
          fecha_salida: '2025-11-16T16:00:00Z',
          medidas: [
            { idMedida: 0, idTurno: 1, tipo: 'Petroleo', entrada: 10000, salida: 10100 },
            { idMedida: 1, idTurno: 1, tipo: 'Petroleo', entrada: 10010, salida: 10100 },
            { idMedida: 2, idTurno: 1, tipo: 'Regular', entrada: 10000, salida: 10100 },
            { idMedida: 3, idTurno: 1, tipo: 'Regular', entrada: 10500, salida: 12100 },
            { idMedida: 4, idTurno: 1, tipo: 'Primiun', entrada: 10800, salida: 12100 },
            { idMedida: 5, idTurno: 1, tipo: 'Primiun', entrada: 10700, salida: 11100 },
          ],
          observaciones: '100 a la Sra. Marta, 50 a Juanito, 200 a Nono.',
        },
        {
          idTurno: 2,
          fecha_entrada: '2025-11-17T16:00:00Z',
          fecha_salida: '2025-11-18T16:00:00Z',
          medidas: [
            { idMedida: 6, idTurno: 2, tipo: 'Petroleo', entrada: 10000, salida: 10100 },
            { idMedida: 7, idTurno: 2, tipo: 'Petroleo', entrada: 10010, salida: 10100 },
            { idMedida: 8, idTurno: 2, tipo: 'Regular', entrada: 10000, salida: 10100 },
            { idMedida: 9, idTurno: 2, tipo: 'regular', entrada: 10500, salida: 11100 },
            { idMedida: 10, idTurno: 2, tipo: 'Primiun', entrada: 10800, salida: 11200 },
            { idMedida: 11, idTurno: 2, tipo: 'Primiun', entrada: 10700, salida: 11100 },
          ],
          observaciones: '200 a Nono, 50 Yape',
        },
      ],
    },
  ],
};
