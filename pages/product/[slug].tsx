import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";
import { Button, Chip, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ShopLayout } from "../../components/layouts";
import { ProductSlideshow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct, ValidSizes } from "../../interfaces";
import { getProductBySlug, getProductsSlug } from "../../database";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { CartContext } from "../../context";

interface Props {
  product: IProduct;
}

const ProductPage = ({ product }: Props) => {
  const router = useRouter();
  const { addProductToCart } = useContext(CartContext);

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    inStock: product.inStock,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1
  })

  const onSelectSize = (size: ValidSizes) => {
    setTempCartProduct(prev => ({
      ...prev,
      size
    }))
  }

  const onQuantityChange = (quantity: number) => {
    setTempCartProduct(prev => ({
      ...prev,
      quantity
    }))
  }

  const onAddProduct = () => {
    if(!tempCartProduct.size) return;
    addProductToCart(tempCartProduct);
    router.push('/cart');
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            {/* title */}
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>

            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>

              {/* Cantidad */}
              <ItemCounter 
                counter={tempCartProduct.quantity} 
                onQuantityChange={onQuantityChange}
                maxValue={tempCartProduct.inStock}
              />

              {/* Tallas */}
              <SizeSelector 
                onSelectSize={onSelectSize} 
                selectedSize={tempCartProduct.size} 
                sizes={product.sizes} 
              />
            </Box>

            {
              (product.inStock === 0) ? (
                <Chip label='No hay disponibles' color='error' variant='outlined' />
              ) : (
                <Button color="secondary" className="circular-btn" onClick={onAddProduct}>
                  {
                    tempCartProduct.size
                    ? "Agregar al carrito"
                    : "Seleccione una talla" 
                  }
                </Button>
              )
            }

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// *********** use in production ****************
// *********** use in production ****************
// *********** use in production ****************

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await getProductsSlug();

  return {
    paths: slugs.map(slug => ({params: {slug}})),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const { slug = "" } = params as { slug: string }

  const product = await getProductBySlug(slug);

  if(!product){
    return {
      redirect:{
        destination: "/",
        permanent: false
      },
      revalidate: 86400
    }
  }
  
  return {
    props: {product},
  };
};


// *********** use in develop ****************
// *********** use in develop ****************
// *********** use in develop ****************

// export const getServerSideProps: GetServerSideProps = async ({params}) => {
//   const { slug = "" } = params as { slug: string }

//   const product = await getProductBySlug(slug);

//   if(!product){
//     return {
//       redirect:{
//         destination: "/",
//         permanent: false
//       },
//       revalidate: 86400
//     }
//   }
  
//   return {
//     props: {product},
//   };
// };

export default ProductPage;
