export function ManagementPanel() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white px-5 py-5 text-sm shadow-sm">
      <h2 className="mb-4 text-center text-sm font-semibold tracking-wide">Management</h2>

      <ul className="space-y-4 text-xs">
        <li className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[14px] text-emerald-600">
            👤
          </div>
          <span>Manage Details</span>
        </li>
        <li className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-[14px] text-emerald-600">
            📝
          </div>
          <span>Manage Posts</span>
        </li>
        <li className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[14px] text-emerald-600">
            ⚙️
          </div>
          <span>Settings</span>
        </li>
      </ul>
    </aside>
  )
}
