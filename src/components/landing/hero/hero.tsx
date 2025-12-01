import React from 'react'
import styles from './hero.module.css'
import Image from 'next/image'
import clsx from 'clsx'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1 className={clsx('delaySmallReveal bold', styles.title)}>
          Aprenda na prática como <br />
          instalar, manter e <br /> reparar
          equipamentos <br /> de refrigeração <span className="emphasis downLinearBg">
            com uma <br /> empresa do setor.
          </span>
        </h1>
        <p className={clsx(styles.subtitle, 'delayMediumReveal')}>
          Participe do
          <span className="emphasis downLinearBg"> curso presencial</span>
          , aprenda <br /> na
          <span className="emphasis downLinearBg"> prática</span>
          , conquiste seu
          <span className="emphasis downLinearBg"> certificado <br /></span>
          e inicie sua carreira na refrigeração.
        </p>
        <div className={clsx(styles.containerButton, 'delayLargeReveal')}>
          <a href="#classes" className={clsx(styles.registerButton, "leftLinearBg")}>
            QUERO GARANTIR MINHA VAGA
          </a>
        </div>
      </div>
      <div className={styles.right}>
        <div className={clsx(styles.imageContainer, 'delaySmallReveal')}>
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