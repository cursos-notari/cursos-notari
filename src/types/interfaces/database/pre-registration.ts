import { Order } from "../payment/pagbank/order";

export interface PreRegistration {
  id: string;
  class_id: string;
  name: string | null;
  surname: string | null;
  email: string;
  phone: string | null;
  cpf: string | null;
  
  street: string | null;
  number: string | null;
  complement: string | null;
  locality: string | null;
  city: string | null;
  region_code: string | null;
  state: string | null;
  postal_code: string | null;
  
  status: 'pending' | 'confirmed' | 'cancelled' | string;
  
  pagbank_order_id: string | null;
  pagbank_order_data: Order; // jsonb é mapeado para um objeto genérico
  pagbank_order_created_at: string | null;
  
  created_at: string;
  updated_at: string;
  expires_at: string;
  confirmed_at: string | null;
}