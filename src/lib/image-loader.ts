import type { ImageLoaderProps } from 'next/image'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export default function supabaseImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith('http')) {
    if (src.includes('supabase.co')) {
      const sep = src.includes('?') ? '&' : '?'
      return `${src}${sep}w=${width}&q=${quality || 75}`
    }
    return src
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${src}?w=${width}&q=${quality || 75}`
}
