interface UF {
  id: number;
  sigla: string;
  nome: string;
  regiao: {
    id: number;
    sigla: string;
    nome: string;
  };
}

export const getUFs = async (): Promise<UF[]> => {

  const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`);
  const data = await response.json();

  if (data.erro) throw new Error("Erro ao buscar UF's");

  return data;
};