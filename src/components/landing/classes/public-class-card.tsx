import Link from 'next/link';
import { PublicClass } from '@/types/database/class';

export default function PublicClassCard({ class: classData }: { class: PublicClass }) {
  return (
    <div key={classData.id} className="flex flex-col h-full border rounded-lg p-4 justify-between shadow-md w-full max-w-sm">
      {/* Informações principais com divisores */}
      <div className="space-y-2 mb-4">
        <div className='border-b border-gray-100 pb-2'>
          <h3 className="text-xl text-center text-gray-600 font-semibold">
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
      <div className="mb-4 border bg-gray-50 rounded-lg p-4 text-center">
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
      <Link
        href={`/checkout/${classData.id}`}
        className="uppercase leftLinearBg text-background! w-full py-3 outline-none border-none rounded-full text-lg tracking-wider text-center transition-transform duration-300 ease-in-out hover:scale-[1.02]"
      >
        GARANTIR MINHA VAGA
      </Link>
    </div>
  )
}