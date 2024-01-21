import { Header } from '@tanstack/react-table'
import { clsx } from 'clsx'

export function TableSummary<Data extends object>({
  children,
  header,
  index,
  isBorderless,
  groupLength = 1,
}: {
  children: React.ReactNode
  header: Header<Data, unknown>
  index: number
  isBorderless?: boolean
  groupLength?: number
}) {
  return (
    <th
      key={header.id}
      colSpan={header.colSpan}
      className={clsx(
        'border relative border-black bg-gray-600 text-sm font-normal',
        {
          'border-l-0': index === 0 && isBorderless,
          'border-r-0': index === groupLength - 1 && isBorderless,
          'border-b-0': isBorderless,
          'border-t-0': isBorderless,
          'text-center': header.colSpan > 1,
          'text-start': header.colSpan === 1,
          'sticky left-0 z-20': header.column.getIsPinned(),
        }
      )}
    >
      <div className={clsx('flex justify-between bg-gray-600 px-2 py-1', {})}>
        {header.isPlaceholder ? null : children || <>&nbsp;</>}
      </div>
    </th>
  )
}
