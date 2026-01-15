import { MedidorListResponse } from '@oil-store/model';

export const createMedidaMapper = (
  data: any,
  idTurno: number,
  type: string,
  MedidaAnterior?: MedidorListResponse[]
) => {
  if (type === 'iniciar') {
    return [
      { entrada: +data.pet11, code: 'pet11', tipo: 'petroleo', turno: { idTurno: idTurno } },
      { entrada: +data.pet21, code: 'pet21', tipo: 'petroleo', turno: { idTurno: idTurno } },
      { entrada: +data.reg12, code: 'reg12', tipo: 'regular', turno: { idTurno: idTurno } },
      { entrada: +data.reg22, code: 'reg22', tipo: 'regular', turno: { idTurno: idTurno } },
      { entrada: +data.pri13, code: 'pri13', tipo: 'primiun', turno: { idTurno: idTurno } },
      { entrada: +data.pri23, code: 'pri23', tipo: 'primiun', turno: { idTurno: idTurno } },
    ];
  }
  if (type === 'cerrar' && Array.isArray(MedidaAnterior)) {
    return MedidaAnterior.map((prev) => {
      const codeKey = String(prev.code ?? '');
      const raw = data[codeKey];

      const parsed = raw !== undefined && raw !== null ? Number(raw) : NaN;

      // Si parsed es un número válido, lo usamos en 'salida', si no, mantenemos el valor anterior
      if (!Number.isFinite(parsed)) {
        return { ...prev };
      }

      return {
        ...prev,
        salida: parsed,
      };
    });
  }
  return data;
};
