// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Component imports
import EditableDataTables from '@views/react-table/EditableDataTables'

const Tables = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4'>React Table</Typography>
        <Typography>Table1</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <EditableDataTables />
      </Grid>
    </Grid>
  )
}

export default Tables
