/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

export const useTooltip = (): [string, React.Dispatch<React.SetStateAction<string>>] => {
  // export const useTooltip = (message: string, setMessage: React.Dispatch<React.SetStateAction<string>>) => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (message !== '') {
      setTimeout(() => {
        setMessage('')
      }, 7000);
    }
  }, [message])

  return [message, setMessage]
}