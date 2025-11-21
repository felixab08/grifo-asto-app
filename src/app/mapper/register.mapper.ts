export const createRegisterCloseAttentionMapper = (data: any, type: string, anterior?: any) => {
  if (type === 'iniciar') {
    return {
      id: new Date().getTime(),
      nombre: 'Juan Pérez',
      fecha_entrada: new Date().toISOString(),
      fecha_salida: '',
      datos: [
        { id: 'pet11', name: 'Petroleo', entrada: data.pet11, salida: 0 },
        { id: 'pet21', name: 'Petroleo', entrada: data.pet21, salida: 0 },
        { id: 'reg12', name: 'Regular', entrada: data.reg12, salida: 0 },
        { id: 'reg22', name: 'Regular', entrada: data.reg22, salida: 0 },
        { id: 'pri13', name: 'Primiun', entrada: data.pri13, salida: 0 },
        { id: 'pri23', name: 'Primiun', entrada: data.pri23, salida: 0 },
      ],
      observaciones: data.obs || '',
    };
  }
  if (type === 'cerrar' && anterior) {
    return {
      id: anterior.id,
      nombre: anterior.nombre,
      fecha_entrada: anterior.fecha_entrada,
      fecha_salida: new Date().toISOString(),
      datos: [
        {
          id: 'pet11',
          name: 'Petroleo',
          entrada: parseInt(anterior.datos[0].entrada),
          salida: parseInt(data.pet11),
        },
        {
          id: 'pet21',
          name: 'Petroleo',
          entrada: parseInt(anterior.datos[1].entrada),
          salida: parseInt(data.pet21),
        },
        {
          id: 'reg12',
          name: 'Regular',
          entrada: parseInt(anterior.datos[2].entrada),
          salida: parseInt(data.reg12),
        },
        {
          id: 'reg22',
          name: 'Regular',
          entrada: parseInt(anterior.datos[3].entrada),
          salida: parseInt(data.reg22),
        },
        {
          id: 'pri13',
          name: 'Primiun',
          entrada: parseInt(anterior.datos[4].entrada),
          salida: parseInt(data.pri13),
        },
        {
          id: 'pri23',
          name: 'Primiun',
          entrada: parseInt(anterior.datos[5].entrada),
          salida: parseInt(data.pri23),
        },
      ],
      observaciones: data.obs || '',
    };
  }
  return data;
};
