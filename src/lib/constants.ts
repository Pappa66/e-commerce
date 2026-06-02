export const APP_NAME = 'D2C Pro'
export const APP_DESCRIPTION = 'E-Commerce D2C - Platform brand mandiri tanpa biaya marketplace'
export const DEFAULT_TAX_RATE = 11 // PPN 11%
export const ITEMS_PER_PAGE = 12

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu Konfirmasi',
  confirmed: 'Dikonfirmasi',
  processing: 'Diproses',
  shipped: 'Dikirim',
  delivered: 'Selesai',
  cancelled: 'Dibatalkan',
  returned: 'Dikembalikan',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-indigo-100 text-indigo-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  returned: 'bg-gray-100 text-gray-800',
}

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: 'Cash on Delivery (COD)',
  midtrans: 'Kartu/Virtual Account (Midtrans)',
  transfer: 'Transfer Bank',
}

export const INDONESIAN_PROVINCES = [
  'Aceh', 'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta',
  'Gorontalo', 'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
  'Kalimantan Barat', 'Kalimantan Selatan', 'Kalimantan Tengah', 'Kalimantan Timur', 'Kalimantan Utara',
  'Kepulauan Bangka Belitung', 'Kepulauan Riau', 'Lampung', 'Maluku', 'Maluku Utara',
  'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Papua', 'Papua Barat', 'Papua Pegunungan',
  'Papua Selatan', 'Papua Tengah', 'Riau', 'Sulawesi Barat', 'Sulawesi Selatan',
  'Sulawesi Tengah', 'Sulawesi Tenggara', 'Sulawesi Utara', 'Sumatera Barat',
  'Sumatera Selatan', 'Sumatera Utara',
]
