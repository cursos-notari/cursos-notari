import { BrasilAPIResponse, ViaCEPResponse } from "@/types/interfaces/address";

export const getAddressByCEP = async (cep: string) => {
  if (!cep || cep.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const data: ViaCEPResponse = await response.json();

    if ('erro' in data) throw new Error();

    if (data.uf !== 'SP') throw new Error('CEP inválido');

    return data;

  } catch (error) {

    if (error instanceof Error && error.name === 'TimeoutError') {
      return null;
    }

    // se o erro for de CEP fora de SP, não tenta a BrasilAPI
    if (error instanceof Error && error.message === 'CEP inválido') {
      throw error;
    }

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`, {
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) return null;

      const data: BrasilAPIResponse = await response.json();

      if ('errors' in data) return null

      if (data.state !== 'SP') throw new Error('CEP inválido');

      return {
        logradouro: data.street,
        bairro: data.neighborhood,
        localidade: data.city,
        uf: data.state,
      };
    } catch (brasilApiError) {
      
      if (brasilApiError instanceof Error && brasilApiError.name === 'TimeoutError') {
        return null
      }
      
      return null
    }
  }
};