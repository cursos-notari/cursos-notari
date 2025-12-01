import { getUFs } from "./get-ufs";

interface Region {
  id: number;
  sigla: string;
  nome: string;
}

interface UF {
  id: number;
  sigla: string;
  nome: string;
  regiao: Region;
}

interface Mesorregiao {
  id: number;
  nome: string;
  UF: UF;
}

interface Microrregiao {
  id: number;
  nome: string;
  mesorregiao: Mesorregiao;
}

interface RegiaoIntermediaria {
  id: number;
  nome: string;
  UF: UF;
}

interface RegiaoImediata {
  id: number;
  nome: string;
  "regiao-intermediaria": RegiaoIntermediaria;
}

interface City {
  id: number;
  nome: string;
  microrregiao: Microrregiao;
  "regiao-imediata": RegiaoImediata;
}

export const getCitiesByUF = async (uf: string): Promise<City[]> => {
  const ufs = await getUFs();

  const isValidUF = ufs.some(curUF => curUF.sigla === uf);

  if (!isValidUF) throw new Error('UF inválida');

  const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
  const data = await response.json();

  if (data.erro) throw new Error('Erro ao buscar municípios');

  return data;
}