import { Add, CategoryOutlined, NewReleases, Newspaper } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useSWR from "swr";
import { AdminLayout } from "../../../components/layouts";
import { Loading } from "../../../components/ui";
import { IProduct } from "../../../interfaces";
import NextLink from 'next/link'

const columns: GridColDef[] = [
  { 
    field: 'img', 
    headerName: 'Foto',
    sortable: false,
    renderCell: (params) => (
        <a href={`/product/${params.row.slug}`} target="_blank" rel="noreferrer">
            <CardMedia
                component='img'
                alt={params.row.title}
                image={params.row.img}
                className='fadeIn'
            />
        </a>
    )
  },
  { 
    field: 'title', 
    headerName: 'Title', 
    width: 250,
    renderCell: (params) => (
      <NextLink href={`/admin/products/${params.row.slug}`} passHref >
        <Link underline="always" color='#000' >
          {params.row.title}
        </Link>
      </NextLink>
    )
  },
  { field: 'gender', headerName: 'Genero'},
  { field: 'type', headerName: 'Tipo'},
  { field: 'inStock', headerName: 'En inventario', width: 130},
  { field: 'price', headerName: 'Precio'},
  { field: 'sizes', headerName: 'Tallas', width: 250},
]

const AdminProductsPage = () => {

  const {data, error} = useSWR<IProduct[]>('/api/admin/products');

  if (!data && !error) {
    return <Loading title="Cargando productos" />;
  }
  
  const rows = data!.map(product => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(' - '),
    slug: product.slug
  }))

  return (
    <AdminLayout
        title={`Productos (${data?.length})`}
        subTitle="Mantenimiento de productos"
        icon={<CategoryOutlined />}
    >

      <Box className="fadeIn" display='flex' justifyContent='flex-end' sx={{mb: 2}} >
        <Button startIcon={<Add/>} color="secondary" className="btn" href='/admin/products/new' >
          Nuevo producto
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default AdminProductsPage;