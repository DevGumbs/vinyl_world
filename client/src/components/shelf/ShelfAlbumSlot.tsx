export function ShelfAlbumSlot() {
  return (
    <div className="flex flex-col items-center text-[11px]">
      <div className="flex flex-col items-center">
        <div className="mb-2 h-24 w-24 rounded-md border border-slate-300 bg-slate-900/80 shadow-md shadow-black/70" />
        <div className="h-2 w-24 rounded-full bg-black shadow-[0_8px_18px_rgba(0,0,0,0.9)]" />
      </div>
      <p className="font-semibold text-slate-50">Album Title</p>
      <p className="text-[10px] text-slate-300">Artist Name</p>
    </div>
  )
}
