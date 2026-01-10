import Image from 'next/image'

export default function Professor() {
  return (
    <section id='professor' className='flex flex-col items-center justify-center space-y-10 px-4'>
      <div className='text-center space-y-2'>
        <h1 className='text-3xl md:text-4xl text-linear bg-linear-to-tl linear-colors font-semibold delay-medium-reveal'>
          Quem vai te ensinar
        </h1>
        <p className='text-gray-600 font-medium delay-small-reveal'>
          Aprenda com quem realmente entende do assunto
        </p>
      </div>

      <div className="flex flex-col lg:flex-row bg-white border border-stone-200 w-8/10 max-w-6xl delay-large-reveal rounded-2xl shadow-lg overflow-hidden">
        {/* Coluna da Imagem */}
        <div className='lg:w-2/5 flex items-center justify-center p-8 bg-linear-to-br from-stone-50 to-stone-100'>
          <div className='relative rounded-2xl overflow-hidden w-56 h-56 shadow-xl ring-4 ring-white'>
            <Image
              src="/img/leandro.jpeg"
              alt='Professor Leandro Notari'
              loading='lazy'
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Coluna do Conteúdo */}
        <div className='lg:w-3/5 flex flex-col justify-center space-y-6 p-8'>
          {/* Nome e Título */}
          <div className='space-y-1'>
            <h2 className='text-3xl md:text-4xl font-bold text-stone-800 tracking-tight'>
              LEANDRO NOTARI
            </h2>
            <div className='h-1 w-24 bg-linear-to-r linear-colors rounded-full'></div>
          </div>

          {/* Qualificações */}
          <div className='space-y-4'>
            {/* Qualificação 1 */}
            <div className='flex items-start space-x-3 group'>
              <div className='shrink-0 w-10 h-10 rounded-xl bg-linear-to-br linear-colors flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform'>
                <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' />
                </svg>
              </div>
              <div>
                <h3 className='text-lg font-bold text-stone-800'>Engenheiro Mecânico</h3>
                <p className='text-sm text-stone-600'>Especializado em PMOC (Plano de Manutenção, Operação e Controle)</p>
              </div>
            </div>

            {/* Qualificação 2 */}
            <div className='flex items-start space-x-3 group'>
              <div className='shrink-0 w-10 h-10 rounded-xl bg-linear-to-br linear-colors flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                </svg>
              </div>
              <div>
                <h3 className='text-lg font-bold text-stone-800'>Pós-Graduação</h3>
                <p className='text-sm text-stone-600'>Especialista em Segurança do Trabalho</p>
              </div>
            </div>

            {/* Qualificação 3 */}
            <div className='flex items-start space-x-3 group'>
              <div className='shrink-0 w-10 h-10 rounded-xl bg-linear-to-br linear-colors flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform'>
                <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                </svg>
              </div>
              <div>
                <h3 className='text-lg font-bold text-stone-800'>Diretor da Notari Engenharia</h3>
                <p className='text-sm text-stone-600'>Empresa líder em climatização e refrigeração com ampla experiência no mercado</p>
              </div>
            </div>
          </div>

          {/* Badge de Destaque */}
          <div className='flex items-center space-x-3 pt-4 border-t border-stone-200'>
            <div className='flex items-center space-x-2 bg-linear-to-r from-sky-50 to-slate-50 px-4 py-2 rounded-full border border-sky-200'>
              <svg className='w-5 h-5 text-sky-600' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
              </svg>
              <span className='text-sky-900 font-semibold text-sm'>Mais de 15 anos de experiência prática</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}