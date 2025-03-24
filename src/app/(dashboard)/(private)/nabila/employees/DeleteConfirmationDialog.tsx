// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

interface DeleteConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, loading }: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Employee</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this employee? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color='error' variant='contained' disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog
