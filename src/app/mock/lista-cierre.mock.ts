export const ListCloseAttentionMock = {
  turno_dia: [
    {
      id: 1,
      nombre: 'Juan Pérez',
      fecha_entrada: '2025-11-15T16:00:00Z',
      fecha_salida: '2025-11-16T16:00:00Z',
      lista_entrada: {
        AD_1_1: 10000,
        AD_2_1: 10010,
        RE_1_2: 20000,
        RE_2_2: 10500,
        PR_1_3: 10800,
        PR_2_3: 10700,
      },
      lista_salida: {
        AD_1_1: 10100,
        AD_2_1: 10500,
        RE_1_2: 20400,
        RE_2_2: 10800,
        PR_1_3: 11000,
        PR_2_3: 10900,
      },
      observaciones: '100 a la Sra. Marta, 50 a Juanito, 200 a Nono.',
    },
    {
      id: 2,
      nombre: 'Juan Pérez',
      fecha_entrada: '2025-12-16T16:00:00Z',
      fecha_salida: '2025-13-17T16:00:00Z',
      lista_entrada: {
        AD_1_1: 10100,
        AD_2_1: 10500,
        RE_1_2: 20400,
        RE_2_2: 10800,
        PR_1_3: 11000,
        PR_2_3: 10900,
      },
      lista_salida: {
        AD_1_1: 10200,
        AD_2_1: 10700,
        RE_1_2: 20500,
        RE_2_2: 10900,
        PR_1_3: 11200,
        PR_2_3: 11200,
      },
      observaciones: 'Yape 100, yape 200, 120 carro Nono, 50 a la Sra. Marta.',
    },
  ],
};
export const CloseAttentionMock = {
  turno_dia: [
    {
      id: 1,
      nombre: 'Juan Pérez',
      fecha_entrada: '2025-11-15T16:00:00Z',
      fecha_salida: '2025-11-16T16:00:00Z',
      datos: [
        { id: 'pet11', name: 'petroleo', entada: 10000, salida: 10100 },
        { id: 'pet21', name: 'petroleo', entada: 10010, salida: 10100 },
        { id: 'reg12', name: 'regular', entada: 10000, salida: 10100 },
        { id: 'reg22', name: 'regular', entada: 10500, salida: 12100 },
        { id: 'pri13', name: 'primiun', entada: 10800, salida: 12100 },
        { id: 'pri23', name: 'primiun', entada: 10700, salida: 11100 },
      ],
      observaciones: '100 a la Sra. Marta, 50 a Juanito, 200 a Nono.',
    },
    {
      id: 2,
      nombre: 'Juan Pérez',
      fecha_entrada: '2025-11-15T16:00:00Z',
      fecha_salida: '2025-11-16T16:00:00Z',
      datos: [
        { id: 'pet11', name: 'petroleo', entada: 10000, salida: 10100 },
        { id: 'pet21', name: 'petroleo', entada: 10010, salida: 10100 },
        { id: 'reg12', name: 'regular', entada: 10000, salida: 10100 },
        { id: 'reg22', name: 'regular', entada: 10500, salida: 11100 },
        { id: 'pri13', name: 'primiun', entada: 10800, salida: 11200 },
        { id: 'pri23', name: 'primiun', entada: 10700, salida: 11100 },
      ],
      observaciones: '100 a la Sra. Marta, 50 a Juanito, 200 a Nono.',
    },
  ],
};
