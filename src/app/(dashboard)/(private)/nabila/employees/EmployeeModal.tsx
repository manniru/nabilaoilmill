'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Firebase Imports
import { collection, addDoc, Timestamp } from 'firebase/firestore'

import { db } from '@/configs/firebase'

// Types
import type { Employee } from './types'

interface EmployeeModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

interface FormErrors {
  [key: string]: string
}

const EmployeeModal = ({ open, onClose, onSuccess }: EmployeeModalProps) => {
  const [formData, setFormData] = useState<Employee>({
    nin: '',
    name: '',
    phone: '',
    address: '',
    dob: '',
    lga: '',
    state: '',
    guarantor: '',
    designation: '',
    dofa: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Required field validation
    Object.entries(formData).forEach(([key, value]) => {
      if (!value || value.trim() === '') {
        newErrors[key] = 'This field is required'
        isValid = false
      }
    })

    // Phone number validation
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
      isValid = false
    }

    // NIN validation (11 digits)
    if (formData.nin && !/^\d{11}$/.test(formData.nin)) {
      newErrors.nin = 'NIN must be 11 digits'
      isValid = false
    }

    // Date validations
    const today = new Date()
    const dob = new Date(formData.dob)
    const dofa = new Date(formData.dofa)

    if (dob > today) {
      newErrors.dob = 'Date of birth cannot be in the future'
      isValid = false
    }

    if (dofa > today) {
      newErrors.dofa = 'Date of first appointment cannot be in the future'
      isValid = false
    }

    if (dofa < dob) {
      newErrors.dofa = 'First appointment date cannot be before date of birth'
      isValid = false
    }

    setErrors(newErrors)

    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async () => {
    setSubmitError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      await addDoc(collection(db, 'nabila_employees'), {
        ...formData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding employee:', error)
      setSubmitError('Failed to add employee. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Add New Employee</DialogTitle>
      <DialogContent>
        {submitError && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='NIN'
              name='nin'
              value={formData.nin}
              onChange={handleChange}
              required
              error={!!errors.nin}
              helperText={errors.nin}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Full Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              required
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Address'
              name='address'
              value={formData.address}
              onChange={handleChange}
              required
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Date of Birth'
              name='dob'
              type='date'
              value={formData.dob}
              onChange={handleChange}
              required
              error={!!errors.dob}
              helperText={errors.dob}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='LGA'
              name='lga'
              value={formData.lga}
              onChange={handleChange}
              required
              error={!!errors.lga}
              helperText={errors.lga}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='State'
              name='state'
              value={formData.state}
              onChange={handleChange}
              required
              error={!!errors.state}
              helperText={errors.state}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Guarantor'
              name='guarantor'
              value={formData.guarantor}
              onChange={handleChange}
              required
              error={!!errors.guarantor}
              helperText={errors.guarantor}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Designation'
              name='designation'
              value={formData.designation}
              onChange={handleChange}
              required
              error={!!errors.designation}
              helperText={errors.designation}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Date of First Appointment'
              name='dofa'
              type='date'
              value={formData.dofa}
              onChange={handleChange}
              required
              error={!!errors.dofa}
              helperText={errors.dofa}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant='contained'
          color='primary'
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EmployeeModal
