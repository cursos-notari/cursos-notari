"use client"

import PaymentMethodSelector from './payment-method-selector';
import { PayMethod } from '@/types/enum/payment-method';
import { Shield, ShieldCheck } from 'lucide-react';
import PixForm from './pix-form';
import CreditCardForm from './credit-card-form';
import { useCheckout } from '@/hooks/zustand/use-checkout';
import { useClassData } from '@/hooks/use-class-data';

export default function PaymentMethods() {

  const { classData } = useClassData();
  const { paymentMethod, setPaymentMethod } = useCheckout();

  const handlePaymentMethodChange = (method: PayMethod) => {
    setPaymentMethod(method, classData.registration_fee);[]
    console.log(paymentMethod)
  };

  return (
    <div className='flex flex-col items-center py-6 bg-background shadow-sm border border-t-0'>
      <PaymentMethodSelector
        paymentMethod={paymentMethod}
        onPaymentSelect={handlePaymentMethodChange}
      />

      <div className="w-full max-w-3xl relative flex flex-col justify-center">

        {paymentMethod === PayMethod.CREDIT_CARD && <CreditCardForm />}

        {paymentMethod === PayMethod.PIX && <PixForm />}

        {paymentMethod === PayMethod.BOLETO &&
          <div className="text-center p-8 min-w-2xl">
            <p className="text-muted-foreground">O pagamento por boleto não está disponível</p>
          </div>
        }

        <div className="flex items-center justify-center gap-1 mt-7">
          <ShieldCheck size={18} color='oklch(62.7% 0.194 149.214)' />
          <p className='text-sm text-center text-gray-500 font-medium'>Suas informações estão seguras</p>
        </div>
      </div>
    </div>
  )
}