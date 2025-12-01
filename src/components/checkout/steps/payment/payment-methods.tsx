"use client"

import { lazy, Suspense, useState } from 'react'
import dynamic from 'next/dynamic';
import { PayMethod } from '@/types/enum/payment-method';
import { Spinner } from '../../../ui/spinner';
import { QrCode } from '@/types/interfaces/order';
import { PaymentMethodSelectorSkeleton } from '@/components/skeletons';
import { Shield, ShieldCheck } from 'lucide-react';
import PixForm from './pix-form';

const PaymentMethodSelector = dynamic(() => import('./payment-method-selector'), {
  ssr: false,
  loading: () => <PaymentMethodSelectorSkeleton />
});

// lazy loading dos componentes de pagamento
const CreditCardForm = lazy(() => import('@/components/checkout/steps/payment/credit-card-form'));
const PixDisplay = lazy(() => import('@/components/checkout/steps/payment/pix-display'));
// const BoletoDisplay = lazy(() => import('@/components/checkout/boleto-display'));

const Loading = () => (
  <div className="flex min-w-2xl justify-center items-center p-8 space-x-2">
    <Spinner /> <span>Carregando método de pagamento...</span>
  </div>
)

interface PaymentMethodsProps {
  customerName: string;
  token: string;
  qrCode: QrCode;
  unitAmount: number;
}

export default function PaymentMethods({ qrCode, unitAmount, token, customerName, ...props }: PaymentMethodsProps) {

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PayMethod>(PayMethod.CREDIT_CARD);

  return (
    <div className='flex flex-col items-center py-6 bg-background shadow-sm border border-t-0'>
      <Suspense fallback={<div className="h-12 w-96 bg-gray-200 animate-pulse rounded-md" />}>
        <PaymentMethodSelector
          customerName={customerName}
          selectedPaymentMethod={selectedPaymentMethod}
          onPaymentSelect={setSelectedPaymentMethod}
        />
      </Suspense>

      <div className="w-full max-w-3xl relative flex flex-col justify-center">
        <Suspense fallback={<Loading />}>
          {selectedPaymentMethod === PayMethod.CREDIT_CARD && (
            <CreditCardForm token={token} unitAmount={unitAmount} />
          )}

          {selectedPaymentMethod === PayMethod.PIX && (
            <PixForm/>
          )}

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