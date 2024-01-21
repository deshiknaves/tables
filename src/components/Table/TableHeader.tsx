import {
  Column,
  ColumnOrderState,
  Header,
  Table,
  flexRender,
} from '@tanstack/react-table'
import { clsx } from 'clsx'
import { useDrag, useDrop } from 'react-dnd'

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

  return (
    <th
      ref={dropRef}
      key={header.id}
      colSpan={header.colSpan}
      className={clsx('border border-gray-800 text-sm border-collapse', {
        'border-l-0': index === 0 && isBorderless,
        'border-r-0': index === groupLength - 1 && isBorderless,
        'border-t-0': isBorderless,
        'text-center': header.colSpan > 1,
        'text-start': header.colSpan === 1,
      })}
      style={{ width, minWidth, opacity: isDragging ? 0.5 : 1 }}
    >
      <div
        className={clsx(
          { 'bg-gray-900': isOver },
          "flex justify-between bg-gray-800 p-2 relative after:content-[''] after:h-full after:-right-1 after:bg-black after:absolute after:top-0 after:w-[2px]"
        )}
        ref={previewRef}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <button ref={dragRef}>🟰</button>
      </div>
    </th>
  )
}
