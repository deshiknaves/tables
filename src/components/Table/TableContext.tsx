import { HeaderGroup, Row } from '@tanstack/react-table'
import { createContext, useContext } from 'react'

type TableContextProps<Data extends object> = {
  rows: Row<Data>[]
  getRowForIndex: (index: number) => Data | undefined
  headerGroups: HeaderGroup<Data>[]
}

export const TableContext = createContext<TableContextProps<any> | null>(null)

export function useTableContext<
  Data extends object = Record<string, unknown>
>() {
  const context = useContext(TableContext)

  if (!context) {
    throw new Error(
      'useTableContext must be used within a TableContextProvider'
    )
  }

  return context as TableContextProps<Data>
}
