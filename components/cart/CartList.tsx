import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { useContext } from "react";
import { CartContext } from "../../context";
import { ICartProduct, IOrderItem, IProduct } from "../../interfaces";
import { ItemCounter } from "../ui";

interface Props {
  editable?: boolean;
  products?: IOrderItem[]; 
}

export const CartList = ({ editable = false, products }: Props) => {

  const { cart, updateQuantity, removeProduct } = useContext(CartContext)

  const onQuantityChange = (product: ICartProduct, quantity: number) => {
    product.quantity = quantity
    updateQuantity(product)
  }

  return (
    <>
      {(products || cart).map((product) => (
        <Grid spacing={2} sx={{mb: 1}} container key={product.slug + product.size}>
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia component='img' image={product.image} />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display='flex' flexDirection='column' >
              <Typography variant="body1" >{product.title}</Typography>
              <Typography variant="body1" >Talla: <strong>{product.size}</strong></Typography>

              {
                editable 
                ? (<ItemCounter 
                    counter={product.quantity} 
                    maxValue={(product as ICartProduct).inStock} 
                    onQuantityChange={(value) => onQuantityChange(product as ICartProduct, value)} 
                  />
                ): <Typography>Cantidad: <strong>{product.quantity}</strong></Typography>
              }
            </Box>
          </Grid>
          <Grid item xs={2} display='flex' flexDirection='column' alignItems='center'>
              <Typography variant='subtitle1' >${product.price}</Typography>
              
              {
                editable && (
                  <Button onClick={() => removeProduct(product as ICartProduct)} size="small" variant='text' color="secondary">
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
