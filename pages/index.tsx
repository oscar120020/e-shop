import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../components/layouts'
import { ProductList } from '../components/products'
import { Loading } from '../components/ui'
import { useProducts } from '../hooks'
import { IProduct } from '../interfaces'


const Home: NextPage = () => {
  const { products, isLoading } = useProducts<IProduct[]>('/products')

  if(isLoading) {
    return <Loading title="Cargando productos" />
  }

  return (
    <ShopLayout title={'Teslo Shop - Home'} pageDescription={'Los mejores productos'}>
      <Typography variant='h1' component="h1" >Tienda</Typography>
      <Typography variant='h2' component="h2" >Todos los productos</Typography>

      <ProductList products={products} />
    </ShopLayout>
  )
}

export default Home
