import { useState, useRef, useEffect } from 'react'
import { useTheme, palettes, type Palette } from '../context/ThemeContext'
import { cn } from '../lib/utils'

export function ThemePicker({ className }: { className?: string }) {
  const { palette: currentPalette, setPalette, theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer"
        aria-label="Themes"
      >
        <span
          className="size-4 rounded-full border border-neutral-300 dark:border-neutral-600"
          style={{ backgroundColor: palettes.find((p) => p.id === currentPalette)?.color }}
        />
        <span className="hidden sm:inline">Themes</span>
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-neutral-950 shadow-xl z-50">
          <p className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wider">Color palette</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {palettes.map((p) => {
              const active = p.id === currentPalette
              return (
                <button
                  key={p.id}
                  onClick={() => { setPalette(p.id as Palette); setOpen(false) }}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors cursor-pointer',
                    active ? 'bg-neutral-100 dark:bg-neutral-800' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900'
                  )}
                  title={p.label}
                >
                  <span
                    className={cn(
                      'size-6 rounded-full border-2 transition-all',
                      active ? 'border-current scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: p.color }}
                  />
                  <span className={cn('text-[10px] font-medium', active ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500')}>
                    {p.label}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="border-t border-neutral-200/60 dark:border-neutral-800/60 pt-3">
            <p className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wider">Mode</p>
            <button
              onClick={() => { toggleTheme(); setOpen(false) }}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <span className="text-neutral-700 dark:text-neutral-300">
                {theme === 'light' ? 'Light' : 'Dark'} mode
              </span>
              <span className="text-base">{theme === 'light' ? '☀️' : '🌙'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
