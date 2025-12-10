"use client"

import { lazy, Suspense, useEffect, useState } from 'react'
import dynamic from 'next/dynamic';
import { PayMethod } from '@/types/enum/payment-method';
import { Spinner } from '@/components/ui/spinner';
import { QrCode } from '@/types/interfaces/payment/pagbank/order';
import { PaymentMethodSelectorSkeleton } from '@/components/skeletons';
import { Shield, ShieldCheck } from 'lucide-react';
import PixForm from './pix-form';
import useCheckout from '@/hooks/zustand/use-checkout';

const PaymentMethodSelector = dynamic(() => import('./payment-method-selector'), {
  ssr: false,
  loading: () => <PaymentMethodSelectorSkeleton />
});

// lazy loading dos componentes de pagamento
const CreditCardForm = lazy(() => import('@/components/checkout/steps/payment/credit-card-form'));
// const BoletoDisplay = lazy(() => import('@/components/checkout/boleto-display'));

const Loading = () => (
  <div className="flex min-w-2xl justify-center items-center p-8 space-x-2">
    <Spinner /> <span>Carregando método de pagamento...</span>
  </div>
)

export default function PaymentMethods() {

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PayMethod>(PayMethod.CREDIT_CARD);

  //TODO AO TROCAR O MÉTODO DE PAGAMENTO PRA PIX O VALOR PRECISA SER O CHEIO
  //TODO AO VOLTAR PRA CARTÃO DE CRÉDITO AS PARCELAS SÃO RESTAURADAS

  return (
    <div className='flex flex-col items-center py-6 bg-background shadow-sm border border-t-0'>
      <Suspense fallback={<div className="h-12 w-96 bg-gray-200 animate-pulse rounded-md" />}>
        <PaymentMethodSelector
          selectedPaymentMethod={selectedPaymentMethod}
          onPaymentSelect={setSelectedPaymentMethod}
        />
      </Suspense>

      <div className="w-full max-w-3xl relative flex flex-col justify-center">
        <Suspense fallback={<Loading />}>
          {selectedPaymentMethod === PayMethod.CREDIT_CARD && (
            <CreditCardForm />
          )}

          {selectedPaymentMethod === PayMethod.PIX && <PixForm/>}

          {selectedPaymentMethod === PayMethod.BOLETO && (
            <div className="text-center p-8 min-w-2xl">
              <p className="text-muted-foreground">O pagamento por boleto não está disponível</p>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-1 mt-7">
            <ShieldCheck size={18} color='oklch(62.7% 0.194 149.214)'/>
            <p className='text-sm text-center text-gray-500 font-medium'>Suas informações estão seguras</p>
          </div>
        </Suspense>
      </div>
    </div>
  )
}