import {
  Column,
  ColumnOrderState,
  Header,
  Table,
  flexRender,
} from '@tanstack/react-table'
import { clsx } from 'clsx'
import { useDrag, useDrop } from 'react-dnd'
import { match } from 'ts-pattern'
import { ChevronDownIcon } from '../icons/ChevronDownIcon'
import { ChevronUpDownIcon } from '../icons/ChevronUpDownIcon'
import { DragHandleIcon } from '../icons/DragHandleIcon'

const reorderColumn = (
  draggedColumnId: string,
  targetColumnId: string,
  columnOrder: string[]
): ColumnOrderState => {
  columnOrder.splice(
    columnOrder.indexOf(targetColumnId),
    0,
    columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
  )
  return [...columnOrder]
}

export function TableHeader<Data extends object>({
  table,
  header,
  index,
  isBorderless,
  groupLength = 1,
  width,
  minWidth,
}: {
  table: Table<Data>
  header: Header<Data, unknown>
  index: number
  isBorderless?: boolean
  groupLength?: number
  width?: number
  minWidth?: number
}) {
  const { getState, setColumnOrder } = table
  const { columnOrder } = getState()
  const { column } = header

  const [{ isOver }, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<Data>) => {
      const newColumnOrder = reorderColumn(
        draggedColumn.id,
        column.id,
        columnOrder
      )
      setColumnOrder(newColumnOrder)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => column,
    type: 'column',
  })

  const hasSubColumns = Boolean(header.subHeaders.length)

  return (
    <th
      ref={dropRef}
      key={header.id}
      colSpan={header.colSpan}
      className={clsx('border relative border-black bg-gray-800 text-sm z-10', {
        'border-l-0': index === 0 && isBorderless,
        'border-r-0': index === groupLength - 1 && isBorderless,
        'border-t-0': isBorderless,
        'border-b-0': isBorderless && !hasSubColumns,
        'text-center': header.colSpan > 1,
        'text-start': header.colSpan === 1,
        'sticky left-0 z-20': column.getIsPinned(),
      })}
      style={{
        width: header.getSize(),
        minWidth,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div
        className={clsx(
          {
            'bg-gray-900': isOver,
          },
          'flex items-center h-full bg-gray-800 px-2 py-1'
        )}
        ref={previewRef}
        onClick={!hasSubColumns ? column.getToggleSortingHandler() : undefined}
      >
        {!hasSubColumns && (
          <button
            className={clsx('w-4 h-4 flex justify-center items-center', {
              'cursor-grab': !isDragging,
              'cursor-grabbing': isDragging,
            })}
            ref={dragRef}
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <DragHandleIcon className="w-full text-gray-400 relative right-1" />
          </button>
        )}
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        {!hasSubColumns && (
          <button
            type="button"
            className="ml-auto hover:bg-indigo-500 rounded-md w-5 h-5 flex justify-center items-center"
            onClick={header.column.getToggleSortingHandler()}
          >
            {match(header.column.getIsSorted())
              .with('asc', () => <ChevronDownIcon className="rotate-180" />)
              .with('desc', () => <ChevronDownIcon />)
              .otherwise(() => (
                <ChevronUpDownIcon />
              ))}
          </button>
        )}
        <div
          onDoubleClick={() => header.column.resetSize()}
          onMouseDown={header.getResizeHandler()}
          onTouchStart={header.getResizeHandler()}
          className={clsx(
            'h-[calc(100%+2px)] w-[4px] bg-indigo-500 absolute -right-0 -top-[1px] z-10',
            'opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-col-resize',
            { 'opacity-100': header.column.getIsResizing() }
          )}
        />
      </div>
    </th>
  )
}
