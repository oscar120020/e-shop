import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { Loading } from '../../components/ui'
import { useProducts } from '../../hooks'
import { IProduct } from '../../interfaces'


const MenPage: NextPage = () => {

  const { products, isLoading } = useProducts<IProduct[]>('/products?gender=men')

  if(isLoading) {
    return <Loading title="Cargando productos" />
  }

  return (
    <ShopLayout title={'Teslo Shop - Hombres'} pageDescription={'Productos para Hombres'}>
      <Typography variant='h1' component="h1" >Hombres</Typography>
      <Typography variant='h2' component="h2" >Productos para Hombres</Typography>

      <ProductList products={products} />
    </ShopLayout>
  )
}

export default MenPage;
