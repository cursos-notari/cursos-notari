'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useClassData } from '@/hooks/use-class-data';
import { useCheckout } from '@/hooks/zustand/use-checkout';
import { useEffect } from 'react';

import { Info } from 'lucide-react';

export default function OrderReview() {

  const { classData } = useClassData();
  const { registration_fee } = classData;
  const { installments, installmentsPrice, setInstallments } = useCheckout();

  // inicializar o checkout com os dados da classe
  useEffect(() => {
    if (registration_fee && installmentsPrice === null) {
      setInstallments(12, registration_fee);
    }
  }, [registration_fee, installmentsPrice, setInstallments]);

  useEffect(() => {
    if (registration_fee && installmentsPrice !== null) {
      // Recalcula se houver inconsistência
      const expectedPrice = registration_fee / installments;
      if (Math.abs(installmentsPrice - expectedPrice) > 0.01) {
        setInstallments(installments, registration_fee);
      }
    }
  }, [installments, registration_fee, installmentsPrice, setInstallments]);

  return (
    <aside className='md:sticky top-10 flex flex-col w-full self-start md:max-w-md h-fit'>
      <Card className='rounded-none'>
        <CardHeader>
          <CardTitle className='text-gray-700 font-semibold!'>Detalhes da compra</CardTitle>
          <CardDescription className='font-medium'>Confira pelo que você está pagando</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col text-sm border space-y-6 py-4 px-4'>

            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <p className='font-semibold'>Curso {classData.name}</p>
                <span className='text-xs font-medium text-gray-600'>1 Vaga</span>
              </div>
              <div className='flex flex-col items-end'>

                {installmentsPrice !== null ? (
                  <div className=''>
                    <span className='text-gray-600 text-xs font-medium'>{installments > 1 && installments + 'x '}</span>
                    <span className='text-base whitespace-nowrap font-medium text-green-600'>
                      {installmentsPrice.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </span>
                  </div>
                ) : <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>}
                <span className='text-xs text-gray-600 h-4'>
                  {installments === 1 ? 'à vista' : '\u00A0'}
                </span>
              </div>
            </div>

            <div className='flex flex-col justify-between space-y-2'>
              <p className='font-medium'>As aulas acontecerão nos dias:</p>
              <ul className="text-gray-800 font-medium list-disc pl-5 ml-2">
                {classData.schedules?.map((schedule: string, index: number) => (
                  <li key={index}>
                    {new Date(schedule).toLocaleString('pt-BR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).replaceAll(',', ' -').replace(/^./, l => l.toUpperCase()) + 'h'}
                  </li>
                ))}
              </ul>
            </div>

            <div className='flex bg-muted p-3 space-x-2 text-center'>
              <Info size={15} className='text-gray-700 mt-0.5' />
              <p className='text-gray-700 font-medium'>
                Após realizar o pagamento, você receberá um <br /> e-mail com os ingressos para as aulas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
