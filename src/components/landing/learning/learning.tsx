import styles from './learning.module.css'
import clsx from 'clsx'
import Modules from './modules'

export default function Learning() {
  return (
    <section className={styles.learning}>
      <h1 className={clsx('emphasis text-sky-600 delayMediumReveal', styles.title)}>
        O que você vai aprender
      </h1>
      <Modules />
    </section>
  )
}
