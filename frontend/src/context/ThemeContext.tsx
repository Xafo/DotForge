import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
type Palette = 'indigo' | 'sapphire' | 'emerald' | 'rose' | 'amber' | 'violet' | 'cyan' | 'slate'

const palettes: { id: Palette; label: string; color: string }[] = [
  { id: 'indigo', label: 'Indigo', color: '#6366f1' },
  { id: 'sapphire', label: 'Sapphire', color: '#3b82f6' },
  { id: 'emerald', label: 'Emerald', color: '#10b981' },
  { id: 'rose', label: 'Rose', color: '#f43f5e' },
  { id: 'amber', label: 'Amber', color: '#f59e0b' },
  { id: 'violet', label: 'Violet', color: '#8b5cf6' },
  { id: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { id: 'slate', label: 'Slate', color: '#64748b' },
]

export { palettes }
export type { Palette }

interface ThemeContextType {
  theme: Theme
  palette: Palette
  toggleTheme: () => void
  setPalette: (palette: Palette) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

function getInitialTheme(): Theme {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

function getInitialPalette(): Palette {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('palette') as Palette | null
    if (stored && palettes.some((p) => p.id === stored)) return stored
  }
  return 'rose'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [palette, setPaletteState] = useState<Palette>(getInitialPalette)

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement
    root.classList.toggle('dark', t === 'dark')
    localStorage.setItem('theme', t)
  }, [])

  const applyPalette = useCallback((p: Palette) => {
    const root = document.documentElement
    palettes.forEach(({ id }) => root.classList.toggle(`theme-${id}`, id === p))
    localStorage.setItem('palette', p)
  }, [])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    applyTheme(t)
  }, [applyTheme])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  const setPalette = useCallback((p: Palette) => {
    setPaletteState(p)
    applyPalette(p)
  }, [applyPalette])

  useEffect(() => {
    applyTheme(theme)
    applyPalette(palette)
  }, [theme, palette, applyTheme, applyPalette])

  return (
    <ThemeContext.Provider value={{ theme, palette, toggleTheme, setPalette }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
