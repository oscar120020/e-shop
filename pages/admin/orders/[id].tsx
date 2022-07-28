import { GetServerSideProps, NextPage } from "next";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Box,
  Chip,
} from "@mui/material";
import { CartList, OrderSummary } from "../../../components/cart";
import { AdminLayout } from "../../../components/layouts";
import { getOrderById } from "../../../database";
import { IOrder } from "../../../interfaces";

interface Props {
  order: IOrder;
}

const AdminOrderPage: NextPage<Props> = ({ order }) => {
  const { orderItems, address, orderSummary, isPaid, _id } = order;

  return (
    <AdminLayout
      title='Orden'
      subTitle={`Resumen de la orden: ${_id}`}
      icon={<ShoppingBagOutlined/>}
    >
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

              <Box sx={{ mt: 2 }} display="flex" flexDirection="column">
                {isPaid ? (
                  <Chip
                    label="Orden pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                  />
                ) : (
                  <Chip
                    label="Pendiente de pago"
                    variant="outlined"
                    color="error"
                    icon={<CreditScoreOutlined />}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id = "" } = query;
  const order = await getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: "/admin/orders",
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

export default AdminOrderPage;
