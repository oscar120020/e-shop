import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { ShopLayout } from "../../components/layouts";
import { CartContext } from "../../context";
import { countries } from "../../helpers";
import { AddressFormData } from "../../interfaces";

const AddressPage = () => {
  const router = useRouter();

  const { address, saveCookieAddress } = useContext(CartContext)
  const savedAddressData: AddressFormData = JSON.parse(Cookies.get('address-data') || JSON.stringify(address));
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: savedAddressData
  })

  const onSaveData = (data: AddressFormData) => {
    Cookies.set("address-data", JSON.stringify(data))
    saveCookieAddress(data)
    router.push('/checkout/summary')
  }

  return (
    <ShopLayout
      title={"Dirección"}
      pageDescription={"Formulario par aguardar tu dirección"}
    >
      <Typography variant="h1" component="h1">
        Dirección
      </Typography>
      <form onSubmit={handleSubmit(onSaveData)} >
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              {...register("firstName", {
                required: "Campo requerido"
              })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              {...register("lastName", {
                required: "Campo requerido"
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              {...register("address", {
                required: "Campo requerido"
              })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2(opcional)"
              variant="filled"
              fullWidth
              {...register("address2")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código Postal"
              variant="filled"
              fullWidth
              {...register("zipCode", {
                required: "Campo requerido"
              })}
              error={!!errors.zipCode}
              helperText={errors.zipCode?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              {...register("city", {
                required: "Campo requerido"
              })}
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField 
                variant="filled" 
                label="País" 
                {...register("country", {
                  required: "Campo requerido"
                })}
                error={!!errors.country}
                helperText={errors.country?.message}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              variant="filled"
              fullWidth
              {...register("phone", {
                required: "Campo requerido"
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>

        <Box>
          <Button
            size="large"
            className="btn"
            color="secondary"
            type='submit'
            fullWidth
            sx={{ my: 2 }}
          >
            Revisar pedido
          </Button>
        </Box>
      </form>

    </ShopLayout>
  );
};

export default AddressPage;
