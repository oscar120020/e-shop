import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react'
import { ShopLayout } from '../components/layouts';

const Page404 = () => {
  return (
    <ShopLayout title="Página no encontrada" pageDescription='Nada que mostrar'>
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 160px)">
            <Typography variant='h1' component="h1" fontSize={70} fontWeight={200} marginRight={1} >404</Typography>
            <Typography variant='h1' component="h1" fontSize={70} fontWeight={200} >|</Typography>
            <Typography marginLeft={1} >Página no encontrada</Typography>
        </Box>
    </ShopLayout>
  )
}

export default Page404;