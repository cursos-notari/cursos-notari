export interface Region {
  id: number;
  sigla: string;
  nome: string;
}

export interface UF {
  id: number;
  sigla: string;
  nome: string;
  regiao: Region;
}

export interface Mesorregiao {
  id: number;
  nome: string;
  UF: UF;
}

export interface Microrregiao {
  id: number;
  nome: string;
  mesorregiao: Mesorregiao;
}

export interface RegiaoIntermediaria {
  id: number;
  nome: string;
  UF: UF;
}

export interface RegiaoImediata {
  id: number;
  nome: string;
  "regiao-intermediaria": RegiaoIntermediaria;
}

export interface City {
  id: number;
  nome: string;
  microrregiao: Microrregiao;
  "regiao-imediata": RegiaoImediata;
}