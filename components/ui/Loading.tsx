import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'
import { ShopLayout } from '../layouts'

export const Loading = ({title}: {title: string}) => {
  return (
    <ShopLayout title={title} pageDescription='La página está cargando' >
        <Box display='flex' justifyContent='center' alignItems='center' height='calc(100vh - 100px)'>
            <CircularProgress size={100} color='info' />
        </Box>
    </ShopLayout>
  )
}
