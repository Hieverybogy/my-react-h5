import { useEffect, useState, Dispatch, SetStateAction } from 'react'

export const useStorageState = <T>(
  key: string,
  defaultValue: T,
  type: 'localStorage' | 'sessionStorage' = 'localStorage'
): [T, Dispatch<SetStateAction<T>>, () => void] => {
  const [state, setState] = useState<T>(() => {
    const value = window[type].getItem(key)
    if (value) {
      try {
        return JSON.parse(value)
      } catch {
        return value as T
      }
    }
    return defaultValue
  })

  useEffect(() => {
    const val = typeof state === 'object' ? JSON.stringify(state) : String(state)
    window[type].setItem(key, val)
  }, [key, state, type])

  const remove = () => {
    window[type].removeItem(key)
    setState(defaultValue)
  }

  return [state, setState, remove]
}
