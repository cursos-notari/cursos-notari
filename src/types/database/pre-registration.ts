import { Order } from "../interfaces/order";

export type PreRegistrationStatus = 'pending_verification' | 'email_verified' | 'confirmed' | 'cancelled' | 'expired';

// as interfaces existentes foram mantidas, mas foram adicionados novos campos
export interface PreRegistration {
  id: string;
  class_id: string;
  token: string;
  user_id?: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  
  // campos obrigatórios adicionados
  // o seu exemplo de row tem 'cpf_encrypted', mas assumimos que o campo 'cpf' original será mantido.
  // se o campo no DB for 'cpf_encrypted', você deve renomeá-lo aqui.
  cpf: string; 
  cpf_encrypted: string; // adicionado, pois está na row de exemplo
  
  status: PreRegistrationStatus;
  verification_code?: string;
  verification_attempts: number;
  verification_code_expires_at?: string;
  email_verified: boolean;
  email_verified_at?: string;
  created_at: string;
  expires_at: string;
  
  // campos de endereço
  street: string;
  number: string;
  complement?: string;
  locality: string;
  city: string;
  regionCode: string;
  postalCode: string;

  // novos campos da row de exemplo
  idx: number; // adicionado: está na row
  resend_attempts: number; // adicionado: está na row
  last_resend_at: string | null; // adicionado: está na row
  
  // campos do pagbank
  pagbank_order_id: string | null; // o campo pode ser null antes da criação do pedido
  // tipado como Order, mas o banco de dados armazena como JSON string
  // você pode querer usar string se for o valor exato do db antes do parse
  pagbank_order_data: Order | null; 
  order_created_at: string | null;
}

export interface CreatePreRegistrationResponse {
  success: boolean;
  code: string;
  message: string;
  data?: PreRegistration;
}

export interface CheckEmailResult {
  exists: boolean;
  token?: string;
  status?: PreRegistration['status'];
  isExpired?: boolean;
}

export interface CreatePreRegistrationResponse {
  success: boolean;
  code: string;
  message: string;
  data?: PreRegistration;
}

export interface CheckEmailResult {
  exists: boolean;
  token?: string;
  status?: PreRegistration['status'];
  isExpired?: boolean;
}