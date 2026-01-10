import Link from 'next/link';
import { PublicClass } from '@/types/interfaces/database/class';
import { Button } from '@/components/ui/button';

export default function PublicClassCard({ class: classData }: { class: PublicClass }) {
  return (
    <div key={classData.id} className="flex flex-col h-full border rounded-lg p-4 justify-center space-y-5 shadow-md w-full max-w-sm">
      {/* Informações principais com divisores */}
      <div className="space-y-3">
        <div className='border-b border-gray-100 pb-2'>
          <h3 className="text-xl text-center text-gray-700 font-semibold">
            {classData.name}
          </h3>
        </div>
        {/* Dia e horário das aulas */}
        <div className="pb-2 border-b border-gray-100">
          <div className='flex items-center justify-center'>
            <h3 className="text-base font-semibold text-gray-700">
              Dia e horário das aulas
            </h3>
          </div>
          <ul className="text-sm text-gray-600 space-y-0.5 text-center list-none">
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

        {/* Período de inscrições */}
        <div className="pb-2 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 text-center">
            Período de inscrições
          </h3>
          <p className="text-sm text-gray-600 text-center">
            {new Date(classData.opening_date).toLocaleDateString('pt-BR')} a{' '}
            {new Date(classData.closing_date).toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Vagas e Local em grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-700">
              Vagas
            </h3>
            <p className="text-sm text-gray-600">
              {classData.total_seats - classData.occupied_seats}
            </p>
          </div>

          <div className="text-center border-l border-gray-100 pl-4">
            <h3 className="text-base font-semibold text-gray-700">
              Local
            </h3>
            <p className="text-sm text-gray-600">{classData.address}</p>
          </div>
        </div>
      </div>

      {/* Preço */}
      <div className="border bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-600 mb-2">
          de <span className="line-through font-semibold">R$ 600,00</span> por apenas
        </p>
        <p className="text-3xl font-bold mb-1 text-gray-800">
          <span className="text-base">12x</span>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(classData.registration_fee / 12)}
        </p>
        <p className="text-sm text-gray-600">
          ou{' '}
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(classData.registration_fee)}
          {' '}à vista
        </p>
      </div>

      {/* CTA */}
      <Link href={`/checkout/${classData.id}`}>
        <Button
          type='button'
          size='lg'
          className='w-full h-11 bg-linear-to-r from-sky-500 via-sky-400 to-sky-300 cursor-pointer tracking-widest transition-transform hover:scale-102 hover:shadow duration-200'
        >
          QUERO GARANTIR MINHA VAGA
        </Button>
      </Link>
    </div>
  )
}