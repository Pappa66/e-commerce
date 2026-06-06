'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) {
      params.set('sort', e.target.value)
    } else {
      params.delete('sort')
    }
    router.push(`/search?${params.toString()}`)
  }

  return (
    <select
      name="sort"
      defaultValue={searchParams.get('sort') || ''}
      onChange={handleChange}
      className="text-sm border rounded-lg px-3 py-2 bg-white"
    >
      <option value="">Terbaru</option>
      <option value="price_asc">Harga Terendah</option>
      <option value="price_desc">Harga Tertinggi</option>
    </select>
  )
}
