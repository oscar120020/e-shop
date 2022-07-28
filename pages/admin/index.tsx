import {
  AccessTimeOutlined,
  AttachMoneyOutlined,
  CancelPresentationOutlined,
  CategoryOutlined,
  CreditCardOffOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  GroupOutlined,
  ProductionQuantityLimitsOutlined,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { SummaryTile } from "../../components/admin";
import { AdminLayout } from "../../components/layouts";
import { Loading } from "../../components/ui";
import { DashboardData } from "../../interfaces";


const DashboardPage = () => {

  const { data, error } = useSWR<DashboardData>('/api/admin/dashboard', {refreshInterval: 60000});
  const [revalidateTimer, setRevalidateTimer] = useState(60)

  useEffect(() => {
    let interval: NodeJS.Timer;
    if(data){
      interval = setInterval(() => {
        setRevalidateTimer(prev => prev > 0 ? prev - 1 : 60 )
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [data])

  if(!data && !error){
    return <Loading title="Cargando" />
  }
  
  return (
    <AdminLayout
      title="Dashboard"
      subTitle="Estadisticas Generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile
          title={`${data?.numberOfOrders}`}
          subTitle="Ordenes Totales"
          icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={`${data?.paidOrders}`}
          subTitle="Ordenes Pagadas"
          icon={<AttachMoneyOutlined color="success" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={`${data?.notPaidOrders}`}
          subTitle="Ordenes Pendientes"
          icon={<CreditCardOffOutlined color="error" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={`${data?.numberOfClients}`}
          subTitle="Clientes"
          icon={<GroupOutlined color="info" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={`${data?.numberOfProducts}`}
          subTitle="Productos"
          icon={<CategoryOutlined color="warning" sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={`${data?.productsWithNoInventory}`}
          subTitle="Sin Existencia"
          icon={
            <CancelPresentationOutlined color="error" sx={{ fontSize: 40 }} />
          }
        />
        <SummaryTile
          title={`${data?.lowInventory}`}
          subTitle="Bajo Inventario"
          icon={
            <ProductionQuantityLimitsOutlined
              color="warning"
              sx={{ fontSize: 40 }}
            />
          }
        />
        <SummaryTile
          title={`${revalidateTimer}`}
          subTitle="Actualización en:"
          icon={<AccessTimeOutlined color="secondary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
