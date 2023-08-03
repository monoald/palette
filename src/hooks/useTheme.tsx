/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"

const useTheme = () => {
  const [body] = useState<HTMLElement>(document.querySelector('body') as HTMLBodyElement)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    body.id = theme
  }, [])

  const toggleTheme = () => {
    body.id === 'dark' ? setTheme('light') : setTheme('dark')
    body.id = body.id === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}

export default useTheme