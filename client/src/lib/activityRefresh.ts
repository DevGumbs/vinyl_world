export const ACTIVITY_REFRESH_EVENT = 'vinyl-world:activity-refresh'

export function emitActivityRefresh() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(ACTIVITY_REFRESH_EVENT))
}
