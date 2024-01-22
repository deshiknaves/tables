import { Column, GroupingState } from '@tanstack/react-table'
import clsx from 'clsx'
import startCase from 'lodash/startCase'
import { useDrop } from 'react-dnd'

export function TableRowGroups<Data extends object>({
  grouping,
  onChange,
}: {
  grouping: GroupingState
  onChange: (grouping: GroupingState) => void
}) {
  const [{ isOver }, dropRef] = useDrop({
    accept: 'column',
    drop: (draggedColumn: Column<Data>) => {
      draggedColumn.getToggleGroupingHandler()()
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  })

  return (
    <div
      ref={dropRef}
      className={clsx('w-full p-2 text-xs', {
        'bg-indigo-500': isOver,
      })}
    >
      {grouping.length ? (
        <>
          <span className="mr-1">Groups: </span>
          <ul className="inline-flex">
            {grouping.map((group) => (
              <li
                key={group}
                className="border border-indigo-800 px-2 rounded-md bg-indigo-500 inline-flex justify-between align-middle mr-1"
              >
                {startCase(group)}{' '}
                <button
                  type="button"
                  className="w-4 h-4 inline-flex justify-center align-middle"
                  onClick={() => {
                    onChange(grouping.filter((g) => g !== group))
                  }}
                >
                  <span className="sr-only">Remove</span>
                  <svg
                    className="w-3 h-"
                    viewBox="0 0 12 12"
                    fill="currentColor"
                  >
                    <path d="M6 5.414l3.536-3.536 1.414 1.414-3.536 3.536 3.536 3.536-1.414 1.414-3.536-3.536-3.536 3.536-1.414-1.414 3.536-3.536-3.536-3.536 1.414-1.414z" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>Drag and drop column here to group</>
      )}
    </div>
  )
}
