export interface MedidorRequest {
  entrada:    number;
  idMedida: number;
  salida:     number;
  tipo:       string;
  turno:      Turno;
}

interface Turno {
  idTurno: number;
}

export interface MedidorResponse {
  entrada:    number;
  idRegistro: number;
  salida:     number;
  tipo:       string;
  turno:      null;
}

