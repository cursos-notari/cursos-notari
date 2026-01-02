import { PersonalDataFormSchema } from "@/validation/zod-schemas/personal-data-form-schema"

export const PERSONAL_DATA_MOCK = {
  name: 'Pedro Lucas',
  surname: 'Almeida Cunha',
  cpf: '56267721892',
  email: 'pedrolucasalmeida7@hotmail.com',
  birthdate: new Date('11-21-2006'),
  phone: '11961842002',
  street: 'Rua Principal',
  number: '123',
  complement: '',
  locality: 'Centro',
  city: 'São Paulo',
  regionCode: 'SP',
  state: 'São Paulo',
  postalCode: '05160030',
  noNumber: false
}

export const EMPTY_PERSONAL_DATA_MOCK: Partial<PersonalDataFormSchema> = {
  name: '',
  surname: '',
  cpf: '',
  email: '',
  birthdate: undefined,
  phone: '',
  street: '',
  number: '',
  complement: '',
  locality: '',
  city: '',
  regionCode: '',
  state: '',
  postalCode: '',
  noNumber: false
}