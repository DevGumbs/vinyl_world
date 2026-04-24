import { API_BASE_URL } from '../lib/api'

export function coverSrc(coverImg: string | null | undefined) {
  if (!coverImg) return '/imgs/default-cover.svg'
  if (/^https?:\/\//i.test(coverImg)) return coverImg
  return `${API_BASE_URL}${coverImg}`
}

