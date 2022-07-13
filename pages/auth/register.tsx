import NextLink from 'next/link'
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import { AuthLayout } from "../../components/layouts";

const RegisterPage = () => {
  return (
    <AuthLayout title="Registrarse">
      <Box sx={{ width: 350, padding: "10px 20px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1" component="h1">
              Crear cuenta
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Name" variant="filled" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Correo" type='email' variant="filled" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Contraseña" type='password' variant="filled" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <Button className='btn' color='secondary' size='large' fullWidth>
                Crear
            </Button>
          </Grid>

          <Grid item xs={12} display='flex' justifyContent='flex-end' >
            <NextLink href={"/auth/login"} passHref>
                <Link color='#000' underline='always'>
                  ¿Ya tienes una cuenta?
                </Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default RegisterPage;
