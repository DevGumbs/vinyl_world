import type { PropsWithChildren } from 'react'

export function AuthCardShell({ children }: PropsWithChildren) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-start justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {children}
      </div>
    </main>
  )
}
