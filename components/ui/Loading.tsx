import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import { ShopLayout } from '../layouts'

export const Loading = ({title}: {title?: string}) => {
  return (
    <ShopLayout title={title || 'Teslo Shop - Home'} pageDescription={'Los mejores productos'} imageFullUrl={`${process.env.HOST_NAME}/home-shop.jpg`} >
        <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 100px)'>
            <CircularProgress size={100} color='info' />
        </Box>
    </ShopLayout>
  )
}
