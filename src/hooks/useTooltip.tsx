/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'

export const useTooltip = (message: string, setMessage: React.Dispatch<React.SetStateAction<string>>) => {
  useEffect(() => {
    if (message !== '') {
      setTimeout(() => {
        setMessage('')
      }, 5000);
    }
  }, [message])
}