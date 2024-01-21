'use client'

import {
  ColumnDef,
  ColumnOrderState,
  Row,
  RowData,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import clsx from 'clsx'
import get from 'lodash/get'
import {
  MouseEvent,
  ReactNode,
  UIEvent,
  useEffect,
  useRef,
  useState,
} from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './Table.css'
import { TableHeader } from './TableHeader'
import { TableSummary } from './TableSummary'
import { useVirtualizedRows } from './useVritualizedRows'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    flush?: boolean
    width?: number
    minWidth?: number
  }
}

export function Table<Data extends object>({
  className,
  columns,
  data,
  height,
  summary,
  isVirtualized = false,
  variant = 'default',
  checkSelected,
  renderRowCells,
  onScroll,
  onRowClick,
}: {
  className?: string
  columns: ColumnDef<Data, any>[]
  data: Data[]
  height?: number
  summary?: Partial<Record<keyof Data, string | number | null>>
  isVirtualized?: boolean
  variant?: 'default' | 'borderless'
  checkSelected?: (row: Row<Data>) => boolean
  renderRowCells?: (row: Row<Data>) => ReactNode | void
  onScroll?: (event: UIEvent<HTMLDivElement>) => void
  onRowClick?: (event: MouseEvent<HTMLTableRowElement>, row: Row<Data>) => void
}) {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const isBorderless = variant === 'borderless'
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columns.map((column) => (column.id || get(column, 'accessorKey')) as string)
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnOrderChange: setColumnOrder,
    columnResizeDirection: 'ltr',
    columnResizeMode: 'onChange',
    state: {
      columnOrder,
      // columnSizing: {
      //   firstName: 150,
      // },
    },
  })

  const { paddingTop, paddingBottom, virtualRows } = useVirtualizedRows({
    parentRef: tableContainerRef,
    count: data.length,
    disabled: !isVirtualized,
  })

  useEffect(() => {
    tableContainerRef.current?.dispatchEvent(new Event('scroll'))
  }, [])

  const { rows } = table.getRowModel()

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        ref={tableContainerRef}
        className={clsx(
          {
            [`h-full w-full relative overflow-auto`]: height !== undefined,
          },
          className
        )}
        onScroll={onScroll}
      >
        <table className="min-w-full relative table-fixed text-secondary-text border-collapse">
          <thead className="sticky top-0 border-b border-gray-800 bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <TableHeader
                    key={header.id}
                    header={header}
                    index={index}
                    table={table}
                    groupLength={headerGroup.headers.length}
                    isBorderless={isBorderless}
                    width={header.column.columnDef.meta?.width}
                    minWidth={header.column.columnDef.meta?.minWidth}
                  />
                ))}
              </tr>
            ))}
            {summary &&
              table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-600">
                  {headerGroup.headers.map((header, index) => (
                    <TableSummary
                      key={`summary-${header.id}`}
                      header={header}
                      index={index}
                      groupLength={headerGroup.headers.length}
                      isBorderless={isBorderless}
                    >
                      {get(summary, header.column.id)}
                    </TableSummary>
                  ))}
                </tr>
              ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {(virtualRows || rows).map((virtualRow, index) => {
              const row = rows[virtualRow.index ?? index] as Row<Data>
              const isSelected = checkSelected ? checkSelected(row) : false
              const cells = row.getVisibleCells()

              return (
                <tr
                  key={row.id}
                  className={clsx({
                    'bg-primary-500 hover:bg-primary-400 text-primary-text':
                      isSelected,
                    'bg-background-contrast hover:bg-background-default':
                      !isSelected && index % 2 === 0,
                    'hover:bg-background-default':
                      !isSelected && index % 2 === 1,
                    'cursor-pointer': Boolean(onRowClick),
                  })}
                  onClick={
                    onRowClick ? (event) => onRowClick(event, row) : undefined
                  }
                >
                  {(renderRowCells && renderRowCells(row)) ??
                    cells.map((cell, index) => {
                      return (
                        <td
                          key={cell.id}
                          className={clsx(
                            'border border-gray-800 text-sm h-full',
                            {
                              'border-l-0': index === 0 && isBorderless,
                              'border-r-0':
                                index === cells.length - 1 && isBorderless,
                              'p-2': !Boolean(
                                cell.column.columnDef.meta?.flush
                              ),
                            },
                            cell.column.columnDef.meta?.className
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      )
                    })}
                </tr>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </DndProvider>
  )
}
