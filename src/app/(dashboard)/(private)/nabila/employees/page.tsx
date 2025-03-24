'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

// Third-party Imports
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

// Firebase Imports
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'

import { db } from '@/configs/firebase'

// Type Imports
import type { Employee } from './types'

// Component Imports
import EmployeeModal from './EmployeeModal'
import DeleteConfirmationDialog from './DeleteConfirmationDialog'

// Style Imports
import styles from '@core/styles/table.module.css'

// Column Definitions
const columnHelper = createColumnHelper<Employee>()

const EmployeesPage = () => {
  const [data, setData] = useState<Employee[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleOpenDeleteDialog = (id: string) => {
    setEmployeeToDelete(id)
    setDeleteDialogOpen(true)
  }

  const columns = [
    columnHelper.accessor('nin', {
      header: 'NIN'
    }),
    columnHelper.accessor('name', {
      header: 'Name'
    }),
    columnHelper.accessor('phone', {
      header: 'Phone'
    }),
    columnHelper.accessor('address', {
      header: 'Address'
    }),
    columnHelper.accessor('dob', {
      header: 'Date of Birth',
      cell: info => new Date(info.getValue()).toLocaleDateString()
    }),
    columnHelper.accessor('lga', {
      header: 'LGA'
    }),
    columnHelper.accessor('state', {
      header: 'State'
    }),
    columnHelper.accessor('guarantor', {
      header: 'Guarantor'
    }),
    columnHelper.accessor('designation', {
      header: 'Designation'
    }),
    columnHelper.accessor('dofa', {
      header: 'First Appointment',
      cell: info => new Date(info.getValue()).toLocaleDateString()
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: props => {
        const handleEdit = (employee: Employee) => {
          // TODO: Implement edit functionality
          console.log('Edit employee:', employee)
        }

        return (
          <div className='flex gap-2'>
            <Tooltip title='Edit'>
              <IconButton size='small' onClick={() => handleEdit(props.row.original)}>
                <EditIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton size='small' onClick={() => handleOpenDeleteDialog(props.row.original.id || '')}>
                <DeleteIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </div>
        )
      }
    })
  ]

  useEffect(() => {
    try {
      const q = query(collection(db, 'nabila_employees'), orderBy('createdAt', 'desc'))

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          const employees: Employee[] = []

          snapshot.forEach(doc => {
            employees.push({ id: doc.id, ...doc.data() } as Employee)
          })
          setData(employees)
          setLoading(false)
        },
        error => {
          console.error('Error fetching employees:', error)
          setError('Failed to load employees. Please try again later.')
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (error) {
      console.error('Error setting up snapshot:', error)
      setError('Failed to load employees. Please try again later.')
      setLoading(false)
    }
  }, [])

  const handleDelete = async () => {
    if (!employeeToDelete) return

    setDeleteLoading(true)

    try {
      await deleteDoc(doc(db, 'nabila_employees', employeeToDelete))
      setDeleteDialogOpen(false)
      setEmployeeToDelete(null)
    } catch (error) {
      console.error('Error deleting employee:', error)
      setError('Failed to delete employee. Please try again later.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: () => false
    }
  })

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[50vh]'>
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <div className='flex justify-between items-center mb-4'>
            <Typography variant='h4'>Employee Records</Typography>
            <Button variant='contained' onClick={() => setIsModalOpen(true)} startIcon={<AddIcon />}>
              Add Employee
            </Button>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <div className='overflow-x-auto'>
              <table className={styles.table}>
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </Grid>
      </Grid>

      <EmployeeModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={() => setIsModalOpen(false)} />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setEmployeeToDelete(null)
        }}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity='error'>
          {error}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EmployeesPage
