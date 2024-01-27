import get from 'lodash/get'
import last from 'lodash/last'
import { DownloadIcon } from '../icons/DownloadIcon'
import { useTableContext } from './TableContext'

export function TableExportButton<Data extends object>() {
  const { rows, headerGroups, getRowForIndex } = useTableContext<Data>()
  function exportData() {
    const headers = last(headerGroups)?.headers ?? []

    const data = rows.map((row) => {
      const rowData = getRowForIndex(row.index)
      return headers.map((header) => {
        const column = header.column

        return get(rowData, column.id) ?? ''
      })
    })
    const csvContent = `data:text/csv;charset=utf-8,${data
      .map((row) => row.join(','))
      .join('\n')}`
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'data.csv')
    document.body.appendChild(link)
    link.click()
  }

  return (
    <button
      type="button"
      className="flex items-center gap-1 h-full hover:bg-indigo-500 px-3 active:bg-indigo-600 transition-all"
      title="Export"
      onClick={exportData}
    >
      <DownloadIcon />
    </button>
  )
}
