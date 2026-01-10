import { getUFs } from "./get-ufs";
import { City } from "@/types/interfaces/ibge-api";

export const getCitiesByUF = async (uf: string): Promise<City[]> => {
  const ufs = await getUFs();

  const isValidUF = ufs.some(curUF => curUF.sigla === uf);

  if (!isValidUF) throw new Error('UF inválida');

  const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
  const data = await response.json();

  if (data.erro) throw new Error('Erro ao buscar municípios');

  return data;
}