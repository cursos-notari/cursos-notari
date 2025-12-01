"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PublicClass } from '@/types/database/class';
import { Info } from 'lucide-react';

interface OrderReviewProps {
  classInfo: {
    name: string;
    registration_fee: number;
    schedules: string[];
  }
}

export default function OrderReview({ classInfo }: OrderReviewProps) {
  return (
    <aside className='md:sticky top-10 flex flex-col w-full self-start md:max-w-md h-fit'>
      <Card className='rounded-none'>
        <CardHeader>
          <CardTitle className='text-gray-700 font-semibold!'>Detalhes da compra</CardTitle>
          <CardDescription className='font-medium'>Confira pelo que você está pagando</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col text-sm border rounded-sm space-y-6 py-4 px-4'>

            <div className='flex justify-between'>
              <div className='flex flex-col'>
                <p className='font-semibold'>Curso {classInfo.name}</p>
                <span className='text-xs font-medium text-gray-600'>1 Vaga</span>
                <span></span>
              </div>
              <span className='whitespace-nowrap font-semibold text-green-600'>
                R$ {classInfo.registration_fee}
              </span>
            </div>

            <div className='flex flex-col justify-between space-y-2'>
              <p className='font-medium'>As aulas acontecerão nos dias:</p>
              <ul className="text-gray-800 font-medium list-disc pl-5 ml-2">
                {classInfo.schedules?.map((schedule: string, index: number) => (
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

            <div className='flex bg-muted p-3 space-x-2 text-center rounded-sm'>
              <Info size={15} className='text-gray-700 mt-[2px]' />
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
