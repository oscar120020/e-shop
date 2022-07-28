import { Divider, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { CartContext } from "../../context";
import { currency } from "../../helpers";
import { OrderSummary as IOrderSummary } from "../../interfaces";

interface Props {
  orderSummaryDone?: IOrderSummary
}

export const OrderSummary = ({orderSummaryDone}: Props) => {
  const { orderSummary } = useContext(CartContext);

  const summary = orderSummaryDone ? orderSummaryDone : orderSummary;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography fontWeight="500">{summary.numberOfItems} {summary.numberOfItems === 1 ? "producto" : "productos" }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography fontWeight="500">{currency.format(summary.subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography fontWeight="500">{currency.format(summary.tax)}</Typography>
      </Grid>

      <Divider sx={{ mt: 4 }} />

      <Grid item xs={6}>
        <Typography variant="subtitle1">Total: </Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography variant="subtitle1">{currency.format(summary.total)}</Typography>
      </Grid>
    </Grid>
  );
};
