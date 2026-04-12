import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShelfScene } from '../../components/shelf/ShelfScene'
import { ShelfViewHeader } from '../../components/shelf/ShelfViewHeader'

type ShelfMode = 'vintage' | 'modern' | 'retro'

const BG: Record<ShelfMode, string> = {
  vintage: '/imgs/vintageBG.png',
  modern: '/imgs/modernBG.png',
  retro: '/imgs/retroBG.png',
}

export default function ShelfPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const mode = useMemo((): ShelfMode => {
    const bg = searchParams.get('bg')
    return bg === 'modern' || bg === 'retro' ? bg : 'vintage'
  }, [searchParams])

  function setMode(next: ShelfMode) {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev)
      p.set('bg', next)
      return p
    })
  }

  return (
    <main className="flex-1 space-y-6">
      <ShelfViewHeader mode={mode} onModeChange={setMode} />
      <ShelfScene backgroundImage={BG[mode]} />
    </main>
  )
}
