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
        'border border-gray-600 text-sm border-collapse font-normal',
        {
          'border-l-0': index === 0 && isBorderless,
          'border-r-0': index === groupLength - 1 && isBorderless,
          'border-t-0': isBorderless,
          'text-center': header.colSpan > 1,
          'text-start': header.colSpan === 1,
        }
      )}
    >
      <div
        className={clsx(
          "flex justify-between bg-gray-600 px-2 py-1 relative after:content-[''] after:h-full after:-right-1 after:bg-black after:absolute after:top-0 after:w-[2px]"
        )}
      >
        {header.isPlaceholder ? null : children || <>&nbsp;</>}
      </div>
    </th>
  )
}
