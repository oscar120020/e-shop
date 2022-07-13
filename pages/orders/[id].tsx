import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Link,
  Chip,
} from "@mui/material";
import NextLink from "next/link";
import React from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";

const OrderPage = () => {
  return (
    <ShopLayout
      title="Resumen de orden 2132133"
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1">Orden: ASd32s</Typography>

      {/* <Chip
        sx={{ mt: 2 }}
        label="Pendiente de pago"
        variant="outlined"
        color="error"
        icon={<CreditCardOffOutlined />}
      /> */}

      <Chip
        sx={{ mt: 2 }}
        label="Orden pagada"
        variant="outlined"
        color="success"
        icon={<CreditScoreOutlined />}
      />

      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography>Resumen (4 productos)</Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
                <NextLink href={"/checkout/address"} passHref>
                  <Link underline="always">
                    <Typography>Editar</Typography>
                  </Link>
                </NextLink>
              </Box>

              <Typography>- Oscar Martinez</Typography>
              <Typography>- Santiago, cienfuegos</Typography>
              <Typography>- República Dominicana</Typography>
              <Typography>- 51000</Typography>
              <Typography>- +1 8096589745</Typography>

              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="flex-end">
                <NextLink href={"/cart"} passHref>
                  <Link underline="always">
                    <Typography>Editar</Typography>
                  </Link>
                </NextLink>
              </Box>
              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Typography variant="h1">Pagar</Typography>
                <Chip
                    sx={{ mt: 1 }}
                    label="Orden pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default OrderPage;
