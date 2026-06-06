'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Banner } from '@/types/database'

interface Props {
  banners: Banner[]
}

export default function BannerSlider({ banners }: Props) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % banners.length)
  }, [banners.length])

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + banners.length) % banners.length)
  }, [banners.length])

  const goTo = (index: number) => setCurrent(index)

  useEffect(() => {
    if (isPaused || banners.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, isPaused, banners.length])

  if (!banners.length) return null

  return (
    <div
      className="relative w-full h-[300px] md:h-[450px] overflow-hidden rounded-xl bg-gray-100 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            index === current ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={banner.image_url}
            alt={banner.title || 'Banner'}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
            {banner.title && (
              <h2 className="text-xl md:text-3xl font-bold mb-2">{banner.title}</h2>
            )}
            {banner.subtitle && (
              <p className="text-sm md:text-lg text-white/90 mb-3">{banner.subtitle}</p>
            )}
            {banner.link_url && (
              <Link
                href={banner.link_url}
                className="inline-block bg-white text-gray-900 px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
              >
                Lihat Detail
              </Link>
            )}
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white transition shadow opacity-0 group-hover:opacity-100"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="h-5 w-5 text-gray-800" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white transition shadow opacity-0 group-hover:opacity-100"
            aria-label="Selanjutnya"
          >
            <ChevronRight className="h-5 w-5 text-gray-800" />
          </button>
          <div className="absolute bottom-4 right-4 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  index === current ? 'bg-white w-6' : 'bg-white/50'
                )}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
