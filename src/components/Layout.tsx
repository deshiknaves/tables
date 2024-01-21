import { ReactNode } from 'react'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <header className="h-12 border-b border-indigo-500 shrink-0">
        Header
      </header>
      <div className="flex grow overflow-hidden">
        <menu className="w-[300px] border-r border-indigo-500">Menu</menu>
        <main className="w-full h-full p-3">{children}</main>
      </div>
    </div>
  )
}
