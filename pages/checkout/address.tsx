import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import React from "react";
import { ShopLayout } from "../../components/layouts";

const AddressPage = () => {
  return (
    <ShopLayout
      title={"Dirección"}
      pageDescription={"Formulario par aguardar tu dirección"}
    >
      <Typography variant="h1" component="h1">
        Dirección
      </Typography>

      <Grid container spacing={2} sx={{mt: 2}}>
        <Grid item xs={12} sm={6}>
          <TextField label="Nombre" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Apellido" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Dirección" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Dirección 2(opcional)" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Código Postal" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Ciudad" variant="filled" fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth >
            <Select
                variant="filled"
                label='País'
                value={1}
            >
                <MenuItem selected value='' >Pais</MenuItem>
                <MenuItem value={1} >R. Dominicana</MenuItem>
                <MenuItem value={2} >Argentina</MenuItem>
                <MenuItem value={3} >España</MenuItem>
                <MenuItem value={4} >EEUU</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Teléfono" variant="filled" fullWidth />
        </Grid>
      </Grid>

      <Box>
          <Button size="large" className="btn" color='secondary' fullWidth sx={{my: 2}} >
              Revisar pedido
          </Button>
      </Box>
    </ShopLayout>
  );
};

export default AddressPage;
