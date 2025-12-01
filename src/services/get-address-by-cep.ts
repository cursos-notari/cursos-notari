
export const getAddressByCEP = async (cep: string) => {

  if (!cep || cep.length !== 8) return null;
  
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();
  
  if (data.erro) throw new Error('cep não encontrado');

  return data;
};