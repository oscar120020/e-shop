import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link } from '@mui/material'
import NextLink from 'next/link'
import React from 'react'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'

const SummatyPage = () => {
  return (
    <ShopLayout
      title="Resumen de orden"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1">Resumen de la orden</Typography>

      <Grid container spacing={1} sx={{mt:1}}>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography>Resumen (4 productos)</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1' >Dirección de entrega</Typography>
                <NextLink href={'/checkout/address'} passHref>
                  <Link underline='always' >
                    <Typography>Editar</Typography>
                  </Link>
                </NextLink>
              </Box>

              <Typography>- Oscar Martinez</Typography>
              <Typography>- Santiago, cienfuegos</Typography>
              <Typography>- República Dominicana</Typography>
              <Typography>- 51000</Typography>
              <Typography>- +1 8096589745</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='flex-end'>
                <NextLink href={'/cart'} passHref>
                  <Link underline='always' >
                    <Typography>Editar</Typography>
                  </Link>
                </NextLink>
              </Box>
              <OrderSummary/>

              <Box sx={{ mt: 3 }}>
                <Button color="secondary" className="circular-btn" fullWidth>
                  Confirmar Orden
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummatyPage