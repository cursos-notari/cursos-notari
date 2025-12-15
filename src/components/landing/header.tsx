'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`flex items-center justify-between h-20 px-15 py-3 border-b sticky top-0 bg-white z-50 transition-shadow duration-300 ${hasScrolled ? 'shadow' : ''}`}>
      <Image
        alt="Logo"
        src={'/img/logo-secundary-fit-simple.png'}
        width={150}
        height={150}
        priority
      />
      <nav className='hidden md:flex gap-8'>
        <Link href="#hero" className='text-gray-700 hover:text-gray-900 font-medium transition-colors'>
          Início
        </Link>
        <Link href="#public" className='text-gray-700 hover:text-gray-900 font-medium transition-colors'>
          Público
        </Link>
        <Link href="#learning" className='text-gray-700 hover:text-gray-900 font-medium transition-colors'>
          Aprendizado
        </Link>
        <Link href="#professor" className='text-gray-700 hover:text-gray-900 font-medium transition-colors'>
          Professor
        </Link>
        <Link href="#classes" className='text-gray-700 hover:text-gray-900 font-medium transition-colors'>
          Turmas
        </Link>
      </nav>
    </header>
  )
}