import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { Loading } from '../../components/ui'
import { useProducts } from '../../hooks'
import { IProduct } from '../../interfaces'


const WomenPage: NextPage = () => {

  const { products, isLoading } = useProducts<IProduct[]>('/products?gender=women')

  if(isLoading) {
    return <Loading title="Cargando productos" />
  }

  return (
    <ShopLayout title={'Teslo Shop - Mujeres'} pageDescription={'Productos para Mujeres'}>
      <Typography variant='h1' component="h1" >Mujeres</Typography>
      <Typography variant='h2' component="h2" >Productos para Mujeres</Typography>

      <ProductList products={products} />
    </ShopLayout>
  )
}

export default WomenPage;
