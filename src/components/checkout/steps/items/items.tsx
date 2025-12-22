import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { PublicClass } from '@/types/interfaces/database/class';
import { useClassData } from '@/hooks/use-class-data';


interface ItemsProps {
  className?: string;
  onNext: () => void;
  classData?: PublicClass;
}

export default function Items({ className, onNext}: ItemsProps) {

  const { classData } = useClassData();

  return (
    <div className={cn('p-7 bg-background border border-t-0 text-gray-700 space-y-7', className)}>
      <div className='flex justify-between'>
        <div className='w-7/10 space-y-2'>
          <p className='font-medium'>Curso {classData.name}</p>
          <div className="text-sm pl-5 space-y-3">
            <div className='space-y-1'>
              <ul className='font-normal list-disc'>
                <li className='font-semibold'>O que esperar:</li>
              </ul>
              <ul className='list-disc pl-4 space-y-2'>
                <li>Fundamentos sobre refrigeração </li>
                <li>Como instalar e fazer manutenção de máquinas</li>
              </ul>
            </div>
            <div className='space-y-1'>
              <ul className='font-normal list-disc'>
                <li className='font-semibold'>Para quem é:</li>
              </ul>
              <ul className='list-disc pl-4 space-y-2'>
                <li>Pessoas que querem iniciar na área de refrigeração, aprendendo do zero.</li>
              </ul>
            </div>
            <div className='space-y-1'>
              <ul className='font-normal list-disc'>
                <li className='font-semibold'>Até onde vamos:</li>
              </ul>
              <ul className='list-disc pl-4 space-y-2'>
                <li>Preencher.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className='text-end'>
          <h6 className='text-xs line-through'>R$ {classData.registration_fee},00</h6>
          <p className='text-sm'>12x <b className='text-lg'>R$ {(classData.registration_fee / 12).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b></p>
          <p className='text-sm'>ou <b>R$ {classData.registration_fee.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> à vista</p>
        </div>
      </div>
      <div className='w-full flex justify-end'>
        <Button
          className='w-full'
          onClick={onNext}
          variant='personalized'
          size='default'
        >
          Avançar
        </Button>
      </div>
    </div>
  )
}