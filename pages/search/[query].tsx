import { GetServerSideProps } from "next";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { IProduct } from "../../interfaces";
import { getAllProducts, getProductsByQuery } from "../../database";

interface Props {
  products: IProduct[];
  foundProduct: boolean;
  query: string;
}

const SearchPage = ({ products, foundProduct, query }: Props) => {
  const router = useRouter();

  return (
    <ShopLayout
      title={`${query}`}
      pageDescription="Todos los productos que coinciden con ..."
    >
      <Typography variant="h1" component="h1">
        Buscar Producto
      </Typography>
        {
            foundProduct
            ? <Typography textTransform='capitalize' sx={{paddingBottom: 2}} variant="h2" component="h2">{query}</Typography> 
            : (
                <Box display='flex'>
                    <Typography sx={{paddingBottom: 2}} variant="h2" component="h2">No se encontró ningún producto:</Typography>
                    <Typography textTransform='capitalize' sx={{paddingBottom: 2, ml: 1}} variant="h2" component="h2" color='secondary' >{query}</Typography>
                </Box>
            )
        }
      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };

  if (!query) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  let products = await getProductsByQuery(query);
  const foundProduct = products.length > 0;

  if(!foundProduct){
    products = await getAllProducts();
  }

  return {
    props: {
      products,
      foundProduct,
      query
    },
  };
};

export default SearchPage;
