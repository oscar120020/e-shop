import { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getOrderById } from "../../database";
import { IOrder } from "../../interfaces";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { tesloApi } from "../../api";
import { useRouter } from "next/router";

export type OrderResponseBody = {
  id: string;
  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED";
};
interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const router = useRouter();
  const { orderItems, address, orderSummary, isPaid, _id } = order;
  const [isPaying, setIsPaying] = useState(false);

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("No se realizó el pago");
    }
    setIsPaying(true)

    try {
      await tesloApi.post("/orders/pay", {
        transactionId: details.id,
        orderId: _id,
      });

      router.reload();
    } catch (error) {
      setIsPaying(false)
      console.log(error);
      alert("Error");
    }
  };

  return (
    <ShopLayout
      title={`Resumen de orden ${_id}`}
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1">Orden: {_id}</Typography>

      {isPaid ? (
        <Chip
          sx={{ mt: 2 }}
          label="Orden pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ mt: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid className="fadeIn" container spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={7}>
          <CartList products={orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography>
                Resumen ({orderSummary.numberOfItems}{" "}
                {orderSummary.numberOfItems === 1 ? "producto" : "productos"})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">
                  Dirección de entrega
                </Typography>
              </Box>

              <Typography>
                {address.firstName} {address.lastName}
              </Typography>
              <Typography>
                {address.address}
                {address.address2 && `, ${address.address2}`}
              </Typography>
              <Typography>
                {address.country}, {address.city}
              </Typography>
              <Typography>{address.zipCode}</Typography>
              <Typography>{address.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary orderSummaryDone={orderSummary} />

              <Box display="flex" flexDirection="column" sx={{ mt: 2 }}>

                <Box sx={{display: isPaying ? 'flex' : 'none'}} display='flex' justifyContent='center' alignItems='center' >
                  <CircularProgress/>
                </Box>

                <Box sx={{display: isPaying ? 'none' : 'flex'}} flexDirection='column' >
                  {isPaid ? (
                    <Chip
                      label="Orden pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: orderSummary.total.toString(),
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          onOrderCompleted(details);
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { id = "" } = query;
  const session: any = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await getOrderById(id.toString());

  if (!order || order.user !== session.user._id) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
