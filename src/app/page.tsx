'use client'

import { FullContainer } from '@/components/FullContainer'
import { Layout } from '@/components/Layout'
import { Table } from '@/components/Table/Table'
import { faker } from '@faker-js/faker'
import { useWorker } from '@koale/useworker'
import { createColumnHelper } from '@tanstack/react-table'
import sample from 'lodash/sample'
import { useRef } from 'react'
import useMeasure from 'react-use-measure'

type Person = {
  id: number
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.group({
    id: 'name',
    header: 'Name',
    columns: [
      columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        header: () => <span>First Name</span>,
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor('lastName', {
        cell: (info) => <i>{info.getValue()}</i>,
        header: () => <span>Last Name</span>,
        footer: (info) => info.column.id,
      }),
    ],
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

const data: Person[] = []
for (let i = 0; i < 1000; i++) {
  data.push({
    id: i,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 100 }),
    visits: faker.number.int({ min: 0, max: 1000 }),
    status: sample(['relationship', 'complicated', 'single']),
    progress: faker.number.int({ min: 0, max: 100 }),
  })
}

export default function Home() {
  const workingRef = useRef(false)
  // const [data, setData] = useState<Person[]>([])
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

  // useEffect(() => {
  //   if (workingRef.current) {
  //     return
  //   }

  //   async function getData() {
  //     const data = await dataWorkerRef.current({})

  //     setData(data.data)
  //     workingRef.current = false
  //   }

  //   setTimeout(getData, 500)
  //   workingRef.current = true
  // }, [])

  return (
    <Layout>
      <FullContainer className="border border-gray-800 rounded-md overflow-hidden">
        {(bounds) => (
          <Table
            columns={columns}
            data={data}
            isVirtualized
            summary={{
              firstName: data.length,
              lastName: data.length,
              age: data.length,
              visits: data.length,
              status: data.length,
              progress: data.length,
            }}
            height={bounds.height}
            variant="borderless"
          />
        )}
      </FullContainer>
    </Layout>
  )
}
