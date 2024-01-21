import { Header, flexRender } from '@tanstack/react-table'
import { clsx } from 'clsx'

export function TableHeader<Data extends object>({
  header,
  index,
  isBorderless,
  groupLength = 1,
  width,
  minWidth,
}: {
  header: Header<Data, unknown>
  index: number
  isBorderless?: boolean
  groupLength?: number
  width?: number
  minWidth?: number
}) {
  return (
    <th
      key={header.id}
      colSpan={header.colSpan}
      className={clsx('border border-gray-800 p-2 text-sm', {
        'border-l-0': index === 0 && isBorderless,
        'border-r-0': index === groupLength - 1 && isBorderless,
        'border-t-0': isBorderless,
        'text-center': header.colSpan > 1,
        'text-start': header.colSpan === 1,
      })}
      style={{ width, minWidth }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  )
}
