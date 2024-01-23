'use client'

import {
  ColumnDef,
  ColumnOrderState,
  GroupingState,
  Row,
  RowData,
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getGroupedRowModel,
  getSortedRowModel,
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
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import './Table.css'
import { TableHeader } from './TableHeader'
import { TableRowGroups } from './TableRowGroups'
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
  const [sorting, setSorting] = useState<SortingState>([])
  const [grouping, setGrouping] = useState<GroupingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnOrderChange: setColumnOrder,
    onGroupingChange: setGrouping,
    onPaginationChange: () => undefined,
    columnResizeDirection: 'ltr',
    columnResizeMode: 'onChange',
    enableColumnPinning: true,
    keepPinnedRows: true,
    enableSorting: true,
    onSortingChange: setSorting,
    state: {
      sorting,
      grouping,
      columnOrder,
      columnPinning: {
        left: ['firstName', 'lastName'],
        right: [],
      },
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

  const headerGroups = table.getHeaderGroups()
  const summaryGroupIndex = headerGroups.length - 1

  return (
    <DndProvider backend={HTML5Backend}>
      <TableRowGroups grouping={grouping} onChange={setGrouping} />
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
        <table
          className="min-w-full relative table-auto text-secondary-text border-collapse"
          style={{
            width: table.getTotalSize(),
          }}
        >
          <thead className="sticky top-0 border-b border-gray-800 z-20 bg-black">
            {headerGroups.map((headerGroup) => (
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
              table.getHeaderGroups().map((headerGroup, index) =>
                index === summaryGroupIndex ? (
                  <tr key={headerGroup.id}>
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
                ) : null
              )}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {(virtualRows || rows).map((virtualRow, index) => {
              const row = rows[virtualRow.index ?? index] as Row<Data>

              if (!row) return null

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
                            'border border-gray-800 text-sm h-full bg-black',
                            {
                              'border-l-0': index === 0 && isBorderless,
                              'border-r-0':
                                index === cells.length - 1 && isBorderless,
                              'p-2': !Boolean(
                                cell.column.columnDef.meta?.flush
                              ),
                              'sticky left-0 z-10': cell.column.getIsPinned(),
                            },
                            cell.column.columnDef.meta?.className
                          )}
                        >
                          {cell.getIsGrouped() ? (
                            // If it's a grouped cell, add an expander and row count
                            <>
                              <button
                                type="button"
                                className="flex items-center gap-1"
                                onClick={row.getToggleExpandedHandler()}
                                style={{
                                  cursor: row.getCanExpand()
                                    ? 'pointer'
                                    : 'normal',
                                }}
                              >
                                <ChevronDownIcon
                                  className={clsx(
                                    'text-indigo-300 transition-all',
                                    {
                                      '-rotate-90': !row.getIsExpanded(),
                                    }
                                  )}
                                />{' '}
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}{' '}
                                ({row.subRows.length})
                              </button>
                            </>
                          ) : cell.getIsAggregated() ? (
                            // If the cell is aggregated, use the Aggregated
                            // renderer for cell
                            flexRender(
                              cell.column.columnDef.aggregatedCell ??
                                cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null
                            // Otherwise, just render the regular cell
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
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
