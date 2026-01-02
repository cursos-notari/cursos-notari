export interface ViaCEPAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface BrasilAPIAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

export interface BrasilAPIError {
  message: string,
  type: string,
  name: string,
  errors: [{
    message: string,
    service: string
  }]
}


export type ViaCEPResponse = ViaCEPAddress | { erro: boolean };

export type BrasilAPIResponse = BrasilAPIAddress | BrasilAPIError;