"use client";

import React, { memo } from 'react';
import { Button } from '@/components/ui/button';

import { CreditCard } from 'lucide-react';
import { IconFileBarcode } from '@tabler/icons-react';
import { PayMethod } from '@/types/enum/payment-method';

import dynamic from 'next/dynamic';
import { Spinner } from '@/components/ui/spinner';

const PixIcon = dynamic(() => import('@/components/icons/pix-icon'), {
  ssr: false, // renderiza direto no cliente
  loading: () => <Spinner />
});

interface PaymentMethodSelectorProps {
  paymentMethod: PayMethod;
  onPaymentSelect: (method: PayMethod) => void;
}

const PaymentMethodSelector = memo(function PaymentMethodSelector({
  paymentMethod,
  onPaymentSelect
}: PaymentMethodSelectorProps) {
  return (
    <div className="flex flex-col items-center space-y-4 mb-6 max-h-20">
      <h3 className='text-lg text-center text-gray-600 font-semibold'>
        Selecione a forma de pagamento
      </h3>
      <div className='flex space-x-4'>
        <Button
          className='cursor-pointer'
          variant={paymentMethod === PayMethod.CREDIT_CARD ? 'personalized' : 'outlinePersonalized'}
          onClick={() => onPaymentSelect(PayMethod.CREDIT_CARD)}
          aria-label="Selecionar pagamento com cartão de crédito"
        >
          Cartão de Crédito<CreditCard />
        </Button>
        <Button
          className='cursor-pointer'
          variant={paymentMethod === PayMethod.PIX ? 'personalized' : 'outlinePersonalized'}
          onClick={() => onPaymentSelect(PayMethod.PIX)}
          aria-label="Selecionar pagamento com PIX"
        >
          PIX<PixIcon fill={paymentMethod === PayMethod.PIX ? 'oklch(98.4% 0.003 247.858)' : 'oklch(55.1% 0.027 264.364)'} />
        </Button>
        <Button
          className='cursor-pointer'
          variant={paymentMethod === PayMethod.BOLETO ? 'personalized' : 'outlinePersonalized'}
          onClick={() => onPaymentSelect(PayMethod.BOLETO)}
          aria-label="Selecionar pagamento com boleto"
        >
          Boleto<IconFileBarcode />
        </Button>
      </div>
    </div>
  );
});

export default PaymentMethodSelector;