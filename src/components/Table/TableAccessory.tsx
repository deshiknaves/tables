import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function TableAccessory({ children }: { children: ReactNode }) {
  if (typeof document === 'undefined') {
    return null
  }

  const element = document.getElementById('table-accessory-container')

  if (!element) {
    return null
  }

  return createPortal(children, element)
}
