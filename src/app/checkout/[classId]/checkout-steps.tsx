'use client'

import React from 'react'
import StepButton from './step-button';
import Items from '@/components/checkout/steps/items/items';
import PersonalDataForm from '@/components/checkout/steps/personal/personal-data-form';
import PaymentMethods from '@/components/checkout/steps/payment/payment-methods';
import { CircleUserRound, CreditCard, LucideProps, ShoppingBag } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useCheckoutSteps } from '@/hooks/zustand/use-checkout-steps';

export default function CheckoutSteps() {
  const { currentStep, nextStep, goToStep } = useCheckoutSteps();

  const steps: Array<{
    id: number;
    text: string;
    component: React.ComponentType<any>
    props: any;
    icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  }> = [
      {
        id: 0,
        text: 'Meus itens',
        component: Items,
        icon: ShoppingBag,
        props: {}
      },
      {
        id: 1,
        text: 'Meus dados',
        icon: CircleUserRound,
        component: PersonalDataForm,
        props: {}
      },
      {
        id: 2,
        icon: CreditCard,
        text: 'Informações de pagamento',
        component: PaymentMethods,
        props: { goToStep }
      },
    ];

  const commonProps = { onNext: nextStep };

  return (
    <div className='flex w-full max-w-2xl gap-10'>
      <div className='flex flex-col gap-8 w-full'>
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isPrevious = step.id < currentStep;
          const isClickable = isPrevious;

          return (
            <div className='w-full' key={step.id}>
              <StepButton
                icon={step.icon}
                className={cn(
                  'flex items-center w-full text-gray-700 font-semibold transition-colors shadow-sm border gap-2 py-5 pl-5 bg-background justify-between pr-5',
                  isClickable && 'cursor-pointer hover:bg-background/70'
                )}
                text={step.text}
                onClick={isClickable ? () => goToStep(step.id) : undefined}
              >
                {isPrevious && <span className='text-sm text-muted-foreground'>Alterar</span>}
              </StepButton>
              {isActive && (
                <step.component
                  key={step.id}
                  {...commonProps}
                  {...step.props}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}