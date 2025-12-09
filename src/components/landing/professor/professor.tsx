import React from 'react'
import styles from './professor.module.css'
import clsx from 'clsx'
import Image from 'next/image'

export default function Professor() {
  return (
    <section className={styles.professor}>
      <h1 className={clsx('emphasis text-sky-600 delayMediumReveal', styles.title)}>
        Quem vai te ensinar
      </h1>
      <div className={clsx(styles.containerProfessor, "delayLargeReveal")}>
        <div className={styles.containerWrapper}>
          <div className={styles.containerImage}>
            <Image
              src="/img/leandro.jpeg"
              alt='Foto Leandro'
              loading='lazy'
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className={styles.containerText}>
          <h1 className={clsx('emphasis leftLinearBg')}>LEANDRO NOTARI</h1>
          <ul className={styles.professorInfo}>
            <li>
              <span className="emphasis">Engenheiro Mecânico</span> especializado em PMOC
            </li>
            <li>
              Pós-graduado em <span className="emphasis">Segurança do Trabalho</span>
            </li>
            <li>
              Diretor da <span className="emphasis">Notari Engenharia</span>, empresa atuante no setor de <span className="emphasis">climatização e refrigeração</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}