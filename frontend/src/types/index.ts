export interface Usuario {
  id: number;
  nombre: string;
  victorias: number;
}

export interface Intento {
  id: number;
  numero: string;
  picas: number;
  fijas: number;
}

export interface Partida {
  id: number;
  fecha: string;
  finalizada: boolean;
  intentos: Intento[];
}
