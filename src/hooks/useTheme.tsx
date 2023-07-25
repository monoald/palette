import { useState } from "react"

const useTheme = () => {
  const [body] = useState<HTMLElement>(document.querySelector('body') as HTMLBodyElement)
  const [theme, setTheme] = useState('')

  const toggleTheme = () => {
    body.id === '' ? setTheme('light') : setTheme('')
    body.id = body.id === '' ? 'light' : ''
  }

  return { theme, toggleTheme }
}

export default useTheme