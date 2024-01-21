import { useVirtualizer } from '@tanstack/react-virtual'

export function useVirtualizedRows({
  parentRef,
  count,
  disabled = false,
}: {
  parentRef: React.RefObject<HTMLElement>
  count: number
  disabled?: boolean
}) {
  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count,
    estimateSize: () => 40,
    overscan: 10,
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
  })
  const { getVirtualItems, getTotalSize } = rowVirtualizer
  const virtualRows = getVirtualItems()
  const totalSize = getTotalSize()

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0

  return disabled
    ? {
        paddingTop: 0,
        paddingBottom: 0,
      }
    : {
        paddingTop,
        paddingBottom,
        virtualRows,
      }
}
