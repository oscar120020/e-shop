import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { initialData } from "../../database/products";
import { ItemCounter } from "../ui";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
  initialData.products[3],
];

interface Props {
  editable?: boolean
}

export const CartList = ({ editable = false }: Props) => {
  return (
    <>
      {productsInCart.map((product) => (
        <Grid spacing={2} sx={{mb: 1}} container key={product.slug}>
          <Grid item xs={3}>
            <NextLink href={'/product/slug'} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia component='img' image={`/products/${product.images[0]}`} />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display='flex' flexDirection='column' >
              <Typography variant="body1" >{product.title}</Typography>
              <Typography variant="body1" >Talla: <strong>M</strong></Typography>

              {
                editable 
                ? <ItemCounter/>
                : <Typography>Cantidad: <strong>4</strong></Typography>
              }
            </Box>
          </Grid>
          <Grid item xs={2} display='flex' flexDirection='column' alignItems='center'>
              <Typography variant='subtitle1' >${product.price}</Typography>
              
              {
                editable && (
                  <Button size="small" variant='text' color="secondary">
                    Remover
                  </Button>
                )
              }
          </Grid>
        </Grid>
      ))}
    </>
  );
};
