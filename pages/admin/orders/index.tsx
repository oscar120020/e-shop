import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useSWR from "swr";
import { AdminLayout } from "../../../components/layouts";
import { Loading } from "../../../components/ui";
import { currency, dateMapped } from "../../../helpers";
import { IOrder, IUser } from "../../../interfaces";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre Completo', width: 250 },
  { field: 'total', headerName: 'Monto total', width: 150 },
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
  { field: 'quantity', headerName: 'Numero de productos', width: 200, align: 'center' },
  {
    field: "check",
    headerName: "Ver orden",
    width: 100,
    renderCell: (params) => (
      <a href={`/admin/orders/${params.row.id}`} target="_blank" rel="noreferrer" >
        Ver orden
      </a>
    )
  },
  { field: 'createdAt', headerName: 'Creada en', width: 150 }
]

const OrdersPage = () => {

  const {data, error} = useSWR<IOrder[]>('/api/admin/orders');

  if (!data && !error) {
    return <Loading title="Cargando ordenes" />;
  }
  
  const rows = data!.map(order => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: currency.format(order.orderSummary.total),
    paid: order.isPaid,
    quantity: order.orderSummary.numberOfItems,
    createdAt: dateMapped.getDate(order.createdAt || '')
  }))

  return (
    <AdminLayout
        title="Ordenes"
        subTitle="Mantenimiento de ordenes"
        icon={<ConfirmationNumberOutlined/>}
    >
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

export default OrdersPage;