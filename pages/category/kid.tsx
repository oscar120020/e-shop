import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { Loading } from '../../components/ui'
import { useProducts } from '../../hooks'
import { IProduct } from '../../interfaces'


const KidPage: NextPage = () => {

  const { products, isLoading } = useProducts<IProduct[]>('/products?gender=kid')

  if(isLoading) {
    return <Loading title="Cargando productos" />
  }

  return (
    <ShopLayout title={'Teslo Shop - Niños'} pageDescription={'Productos para Niños'}>
      <Typography variant='h1' component="h1" >Niños</Typography>
      <Typography variant='h2' component="h2" >Productos para Niños</Typography>

      <ProductList products={products} />
    </ShopLayout>
  )
}

export default KidPage;
