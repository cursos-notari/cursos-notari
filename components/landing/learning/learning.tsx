import Modules from './modules'

export default function Learning() {
  return (
    <section id='learning' className='flex-col gap-8'>
      <h1 className='text-4xl font-semibold text-linear bg-linear-to-tl linear-colors delay-medium-reveal'>
        O que você vai aprender
      </h1>
      <Modules />
    </section>
  )
}
