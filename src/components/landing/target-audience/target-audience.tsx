import React from 'react'
import clsx from 'clsx'
import styles from './target-audience.module.css'
import Image from 'next/image'

export default function TargetAudience() {
  return (
    <section className={styles.public}>
      <div className={styles.containerIntro}>
        <h1 className={clsx('emphasis text-sky-600 delay-medium-reveal', styles.title)}>
          Para quem é esse curso
        </h1>
        <h3 className={clsx('delay-small-reveal', styles.subtitle)}>Esse curso é para quem...</h3>
      </div>
      <div className={styles.grade}>
        <div className={clsx('interval-card-reveal', styles.item, "diagonalLinearBg")}>
          <div className={styles.containerText}>
            <p>
              Quer começar na área de refrigeração, mesmo sem experiência.
            </p>
          </div>
          <div className={styles.containerImage}>
            <Image loading='lazy' fill src="/icons/worker.png" alt='Trabalhador' />
          </div>
        </div>
        <div className={clsx('interval-card-reveal', styles.item, "diagonalLinearBg")}>
          <div className={styles.containerText}>
            <p>
              Busca uma formação prática e objetiva.
            </p>
          </div>
          <div className={styles.containerImage}>
            <Image loading='lazy' fill src="/icons/check.png" alt='Check' />
          </div>
        </div>
        <div className={clsx('interval-card-reveal', styles.item, "diagonalLinearBg")}>
          <div className={styles.containerText}>
            <p>
              Quer se profissionalizar em
              instalação e manutenção
              de ar-condicionado.
            </p>
          </div>
          <div className={styles.containerImage}>
            <Image loading='lazy' fill src="/icons/air-conditioning.png" alt='Ar condicionado' />
          </div>
        </div>
        <div className={clsx('interval-card-reveal', styles.item, "diagonalLinearBg")}>
          <div className={styles.containerText}>
            <p>
              Procura uma alternativa de
              renda com alta demanda
              no mercado.
            </p>
          </div>
          <div className={styles.containerImage}>
            <Image loading='lazy' fill src="/icons/flying-money.png" alt='Dinheiro voando' />
          </div>
        </div>
      </div>
    </section>
  )
}