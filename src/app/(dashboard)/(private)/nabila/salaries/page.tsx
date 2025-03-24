'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

// Third-party Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { ColumnDef, Row, RowData, Column, Table } from '@tanstack/react-table'

// Type Imports
import type { DataType } from './data'

// Data Imports
import defaultData from './data'

// Style Imports
import styles from '@core/styles/table.module.css'

// Column Definitions
const columnHelper = createColumnHelper<DataType>()

const columns = [
  columnHelper.accessor('fullName', {
    header: 'Name'
  }),
  columnHelper.accessor('email', {
    header: 'Email'
  }),
  columnHelper.accessor('start_date', {
    header: 'Date'
  }),
  columnHelper.accessor('experience', {
    header: 'Experience'
  }),
  columnHelper.accessor('age', {
    header: 'Age'
  })
]

// Extend TableMeta for custom functionality
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
  }
}

// Editable Cell Component
interface EditableCellProps<TData extends RowData> {
  getValue: () => unknown
  row: Row<TData>
  column: Column<TData>
  table: Table<TData>
}

const EditableCell = <TData extends RowData>({ getValue, row, column, table }: EditableCellProps<TData>) => {
  const initialValue = getValue()
  const [value, setValue] = useState(initialValue)

  const onBlur = () => {
    table.options.meta?.updateData(row.index, column.id, value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value as string} onChange={e => setValue(e.target.value)} onBlur={onBlur} />
}

// Default Column Configuration
const defaultColumn: Partial<ColumnDef<DataType>> = {
  cell: ({ getValue, row, column, table }) => {
    return <EditableCell getValue={getValue} row={row} column={column} table={table} />
  }
}

// Editable Data Table Component
const EditableDataTables = () => {
  const [data, setData] = useState(() => defaultData)

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: () => false
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value
              }
            }

            
return row
          })
        )
      }
    }
  })

  return (
    <Card>
      <CardHeader title='Editable Table' />
      <div className='overflow-x-auto'>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 10)
              .map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={styles.cellWithInput}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

// Main Tables Component
const Tables = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4'>Employee Salaries</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <EditableDataTables />
      </Grid>
    </Grid>
  )
}

export default Tables