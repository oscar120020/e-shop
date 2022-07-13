import { RemoveShoppingCartOutlined } from '@mui/icons-material';
import { Box, Divider, Link, Typography } from '@mui/material';
import NextLink from 'next/link';
import React from 'react'
import { ShopLayout } from '../../components/layouts'

const EmptyPage = () => {
  return (
    <ShopLayout title='Carrito vacio' pageDescription='Carrito de compras vacio' >
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 160px)">
            <RemoveShoppingCartOutlined sx={{fontSize: 100}} />
            <Box display='flex' flexDirection='column' alignItems='center' sx={{ml: 2}} >
              <Typography variant='subtitle1' >Su carrito está vacio</Typography>
              <Divider sx={{
                width: 100,
                backgroundColor: 'black',
                height: 1
              }} />
              <NextLink href={'/'} passHref >
                <Link typography={'h4'} color='secondary' >
                  Regresar
                </Link>
              </NextLink>
            </Box>
        </Box>
    </ShopLayout>
  )
}

export default EmptyPage;