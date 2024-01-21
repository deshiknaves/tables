'use client'

import { FullContainer } from '@/components/FullContainer'
import { Layout } from '@/components/Layout'
import { Table } from '@/components/Table/Table'
import { useWorker } from '@koale/useworker'
import { createColumnHelper } from '@tanstack/react-table'
import { useEffect, useRef, useState } from 'react'
import useMeasure from 'react-use-measure'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    header: () => <span>First Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    cell: (info) => info.renderValue(),
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (info) => info.column.id,
  }),
]

export default function Home() {
  const workingRef = useRef(false)
  const [data, setData] = useState<Person[]>([])
  const [ref, bounds] = useMeasure()
  const [dataWorker] = useWorker((value) => {
    return new Promise<{ data: Person[] }>((resolve) => {
      setTimeout(() => {
        const values = []
        for (let i = 0; i < 1000; i++) {
          values.push({
            id: i,
            firstName: 'firstName' + i,
            lastName: 'lastName' + i,
            age: i,
            visits: i,
            status: 'status' + i,
            progress: i,
          })
        }

        resolve({
          data: values,
        })
      }, 1000)
    })
  })
  const dataWorkerRef = useRef(dataWorker)
  dataWorkerRef.current = dataWorker

  useEffect(() => {
    if (workingRef.current) {
      return
    }

    async function getData() {
      console.log('getting data')
      const data = await dataWorkerRef.current({})
      console.log(data)

      setData(data.data)
      workingRef.current = false
    }

    setTimeout(getData, 500)
    workingRef.current = true
  }, [])

  console.log(bounds)

  return (
    <Layout>
      <FullContainer>
        {(bounds) => (
          <Table columns={columns} data={data} height={bounds.height} />
        )}
      </FullContainer>
    </Layout>
  )
}
