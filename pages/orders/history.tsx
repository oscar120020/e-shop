import { GetServerSideProps, NextPage } from "next";
import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import NextLink from "next/link";
import { ShopLayout } from "../../components/layouts";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getUserOrders } from "../../database";
import { IOrder } from "../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullname", headerName: "Nombre Completo", width: 300 },
  {
    field: "paid",
    headerName: "Pagada",
    width: 200,
    renderCell: (params) =>
      params.row.paid ? (
        <Chip variant="outlined" color="success" label="Pagada" />
      ) : (
        <Chip variant="outlined" color="error" label="No agada" />
      ),
  },
  { field: "orderId", headerName: "Order ID", width: 230 },
  {
    field: "orden",
    headerName: "Ver orden",
    width: 200,
    sortable: false,
    renderCell: (params) => (
      <NextLink href={`/orders/${params.row.orderId}`} passHref>
        <Link underline="always">
          {params.row.paid ? (
            <Typography color="black">Ver orden</Typography>
          ) : (
            <Typography color="black">Pagar orden</Typography>
          )}
        </Link>
      </NextLink>
    ),
  },
];

const rows = [
  { id: 1, paid: true, fullname: "Oscar Martinez" },
  { id: 2, paid: false, fullname: "Pedro Mata" },
  { id: 3, paid: true, fullname: "Maria Casas" },
  { id: 4, paid: false, fullname: "Jose Mata" },
  { id: 5, paid: true, fullname: "Alejandro Esteves" },
  { id: 6, paid: true, fullname: "Luisa Mejia" },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage = ({ orders }: Props) => {
  const rows = orders.map((order, index) => ({
    id: index + 1,
    paid: order.isPaid,
    orderId: order._id,
    fullname: `${order.address.firstName} ${order.address.lastName}`,
  }));

  return (
    <ShopLayout
      title={"Historial de ordenes"}
      pageDescription={"Historial de ordenes del cliente"}
    >
      <Typography variant="h1" component="h1">
        Historial de ordenes
      </Typography>

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
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session: any = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?p=/orders/history",
        permanent: false,
      },
    };
  }

  const orders = await getUserOrders(session.user._id);

  return {
    props: {
      orders,
    },
  };
};

export default HistoryPage;
