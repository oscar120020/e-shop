import { Divider, Grid, Typography } from '@mui/material'


export const OrderSummary = () => {
  return (
    <Grid container >
        <Grid item xs={6} >
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='flex-end' >
            <Typography fontWeight='500' >4</Typography>
        </Grid>

        <Grid item xs={6} >
            <Typography>SubTotal</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='flex-end' >
            <Typography fontWeight='500'>353.32</Typography>
        </Grid>

        <Grid item xs={6} >
            <Typography>Impuestos (15%)</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='flex-end' >
            <Typography fontWeight='500'>33.12</Typography>
        </Grid>

        <Divider sx={{mt: 4}} />

        <Grid item xs={6} >
            <Typography variant='subtitle1' >Total: </Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='flex-end' >
            <Typography variant='subtitle1'>$370.40</Typography>
        </Grid>
    </Grid>
  )
}
