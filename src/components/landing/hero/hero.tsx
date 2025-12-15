import React from 'react'
import styles from './hero.module.css'
import Image from 'next/image'
import clsx from 'clsx'

export default function Hero() {
  return (
    <section className='h-[calc(100vh - 50vh)]!'>
      <div className='flex flex-col justify-center space-y-5 w-1/2 h-screen'>
        <h1 className='bold text-stone-900 delay-small-reveal '>
          Aprenda na prática como <br />
          instalar, manter e <br /> reparar
          equipamentos <br /> de refrigeração <span className="emphasis downLinearBg">
            com uma <br /> empresa do setor.
          </span>
        </h1>
        <p className={clsx(styles.subtitle, 'delay-medium-reveal')}>
          Participe do
          <span className="emphasis downLinearBg"> curso presencial</span>
          , aprenda <br /> na
          <span className="emphasis downLinearBg"> prática</span>
          , conquiste seu
          <span className="emphasis downLinearBg"> certificado <br /></span>
          e inicie sua carreira na refrigeração.
        </p>
        <div className={clsx(styles.containerButton, 'delay-large-reveal')}>
          <a href="#classes" className={clsx(styles.registerButton, "leftLinearBg")}>
            QUERO GARANTIR MINHA VAGA
          </a>
        </div>
      </div>
      <div className='flex flex-col w-1/2 h-screen'>
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