import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material'
import Cookies from 'js-cookie'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { CartList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { CartContext } from '../../context'
import { countries } from '../../helpers'

const getCountry = (code: string) => {
  return countries.find(c => c.code === code)?.name;
}

const SummatyPage = () => {

  const router = useRouter();
  const { address, orderSummary, createOrder } = useContext(CartContext);
  const { firstName, lastName, city, address: address1, address2, country, phone, zipCode } = address;
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if(!Cookies.get('address-data')){
      router.push('/checkout/address')
    }
  }, [router])

  const handleCreateOrder = async() => {
    setIsPosting(true);
    const {hasError, message} = await createOrder();
    if(hasError){
      setIsPosting(false);
      setErrorMessage(message)
      return;
    }

    router.replace(`/orders/${message}`)
  }

  if(!address){
    return <></>;
  }

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
              <Typography>Resumen ({orderSummary.numberOfItems} {orderSummary.numberOfItems === 1 ? "producto" : "productos" })</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1' >Dirección de entrega</Typography>
                <NextLink href={'/checkout/address'} passHref>
                  <Link underline='always' >
                    <Typography>Editar</Typography>
                  </Link>
                </NextLink>
              </Box>

              <Typography>{ firstName } { lastName }</Typography>
              <Typography>{ address1 }{address2 && `, ${address2}`}</Typography>
              <Typography>{ country }, {city}</Typography>
              <Typography>{ zipCode }</Typography>
              <Typography>{ phone }</Typography>

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
                <Button disabled={isPosting} onClick={handleCreateOrder} color="secondary" className="circular-btn" fullWidth>
                  Confirmar Orden
                </Button>
                <Chip label={errorMessage} color='error' variant='outlined' sx={{display: errorMessage ? 'flex' : 'none', mt: 1}} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export default SummatyPage