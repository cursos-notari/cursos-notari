import TargetAudienceCard from './target-audience-card'
import { IconName } from 'lucide-react/dynamic';

interface TargetAudienceItem {
  text: string;
  icon: IconName;
  alt: string;
}

const targetAudienceData: TargetAudienceItem[] = [
  {
    text: 'Quer começar na área de refrigeração, mesmo sem experiência.',
    icon: 'hard-hat',
    alt: 'Trabalhador'
  },
  {
    text: 'Busca uma formação prática e objetiva.',
    icon: 'check',
    alt: 'Check'
  },
  {
    text: 'Quer se profissionalizar em instalação e manutenção de ar-condicionado.',
    icon: 'air-vent',
    alt: 'Ar condicionado'
  },
  {
    text: 'Procura uma alternativa de renda com alta demanda no mercado.',
    icon: 'hand-coins',
    alt: 'Dinheiro voando'
  }
]

export default function TargetAudience() {
  return (
    <section id='target-audience' className='flex-col justify-center space-y-20'>
      <div className='flex flex-col justify-center items-center space-y-3'>
        <h1 className='text-4xl text-linear bg-linear-to-tl linear-colors font-semibold delay-medium-reveal'>
          Para quem é esse curso?
        </h1>
        <h3 className='text-gray-600 font-medium delay-small-reveal'>
          Esse curso é para quem...
        </h3>
      </div>
      <div className='grid grid-cols-4 gap-5 w-full h-6/10'>
        {targetAudienceData.map((card, index) => (
          <TargetAudienceCard
            key={index}
            text={card.text}
            icon={card.icon}
          />
        ))}
      </div>
    </section>
  )
}