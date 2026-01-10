import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section className='min-h-[calc(100vh-5rem)]! h-[calc(100vh-5rem)]!'>
      <div className='flex flex-col justify-center gap-10 w-1/2'>
        <h1 className='text-5xl/13 font-bold text-stone-800 delay-small-reveal'>
          Aprenda na prática como<br />
          instalar, manter e <br />
          reparar equipamentos <br />
          de refrigeração
          <span className="text-linear linear-colors bg-linear-to-tl">
            &nbsp;com uma <br />
            empresa do setor.
          </span>
        </h1>
        <p className='text-xl font-medium text-gray-800 delay-medium-reveal'>
          Participe do
          <span className="text-linear linear-colors bg-linear-to-tr font-semibold"> curso presencial</span>
          , aprenda <br /> na
          <span className="text-linear linear-colors bg-linear-to-tr font-semibold"> prática</span>
          , conquiste seu
          <span className="text-linear linear-colors bg-linear-to-tr font-semibold"> certificado <br /></span>
          e inicie sua carreira na refrigeração.
        </p>
        <div className='delay-large-reveal'>
          <Link href="#classes">
            <Button
              type='button'
              size='lg'
              className='h-11 bg-linear-to-r from-sky-500 via-sky-400 to-sky-300 cursor-pointer tracking-widest transition-transform hover:scale-102 hover:shadow duration-200'
            >
              QUERO GARANTIR MINHA VAGA
            </Button>
          </Link>
        </div>
      </div>
      <div className='flex flex-col w-1/2 h-full'>
        <div className='relative w-full h-full delay-small-reveal'>
          <Image
            style={{ objectFit: 'contain', }}
            fill
            priority
            src="/img/air-conditioning.png"
            alt='Ar-condicionado'
          />
        </div>
      </div>
    </section>
  )
}