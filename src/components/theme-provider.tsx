"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  // renamed to avoid conflict
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme")

      if (
        savedTheme === "dark" ||
        savedTheme === "light" ||
        savedTheme === "system"
      ) {
        return savedTheme
      }
    }

    return defaultTheme
  })

  // apply theme to document
  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  // ✅ safe setter (NO recursion)
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme)
    setThemeState(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    setTheme,
  }

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}