'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './button'

type Theme = 'light' | 'dark' | 'system'

export function ThemeProvider({ children, defaultTheme = 'system' }: { children: React.ReactNode, defaultTheme?: Theme }) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme)

  React.useEffect(() => {
    const root = document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = (newTheme: Theme) => {
      root.classList.remove('light', 'dark')
      const effectiveTheme = newTheme === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : newTheme
      root.classList.add(effectiveTheme)
    }

    applyTheme(theme)
    const handleChange = () => { if (theme === 'system') applyTheme('system') }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  return (
    <div className="theme-provider" data-theme={theme}>
      {children}
    </div>
  )
}

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>('system')

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => setTheme('light')}>
        <Sun className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setTheme('dark')}>
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  )
}
