import { getUFs } from "./get-ufs";
import { UF } from "@/types/interfaces/ibge-api";

export const getUF = async (uf: string): Promise<UF[]> => {
  const ufs = await getUFs();

  const isValidUF = ufs.some(curUF => curUF.sigla === uf);

  if (!isValidUF) throw new Error('UF inválida');

  const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}`);
  const data = await response.json();

  if (data.erro) throw new Error('Erro ao buscar municípios');

  return data;
}