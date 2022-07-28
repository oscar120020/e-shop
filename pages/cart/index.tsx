import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from "../../context";

const CartPage = () => {

  const router = useRouter();
  const { cart, isLoaded, orderSummary } = useContext(CartContext)

  useEffect(() => {
    if(isLoaded && cart.length === 0){
      router.push('/cart/empty')
    }
  }, [cart, isLoaded, router])

  if(cart.length === 0){
    return (<></>);
  }

  return (
    <ShopLayout
      title={`Carrito - ${orderSummary.numberOfItems}`}
      pageDescription="Carrito de compras de la tienda"
    >
      <Typography variant="h1">Carrito</Typography>

      <Grid container spacing={1} sx={{mt:1}}>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography>Resumen</Typography>
              <Divider sx={{ my: 1 }} />

              <OrderSummary/>

              <Box sx={{ mt: 3 }}>
                <Button onClick={() => router.push('/checkout/address')} color="secondary" className="circular-btn" fullWidth>
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default CartPage;
