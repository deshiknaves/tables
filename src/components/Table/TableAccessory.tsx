'use client'

import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function TableAccessory({ children }: { children: ReactNode }) {
  const element = document.getElementById('table-accessory-container')

  if (!element) {
    return null
  }

  return createPortal(children, element)
}
