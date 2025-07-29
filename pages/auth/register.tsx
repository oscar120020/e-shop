import NextLink from "next/link";
import { Box, Button, Chip, Grid, Link, TextField, Typography } from "@mui/material";
import { AuthLayout } from "../../components/layouts";
import { useForm } from "react-hook-form";
import { validations } from "../../helpers";
import { tesloApi } from "../../baseApi";
import { ErrorOutline } from "@mui/icons-material";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "../../context";
import { getSession, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();
  const { registerUser } = useContext(AuthContext);
  const [showError, setShowError] = useState('');

  const onRegisterForm = async ({ name, email, password }: FormData) => {
    setShowError('');
    const {hasError, message} = await registerUser(name, email, password)

    if(hasError){
      setShowError(message!)
      setTimeout(() => setShowError(''), 4000);
      return;
    }

    await signIn('credentials', {email, password});
  };

  return (
    <AuthLayout title="Registrarse">
      <form onSubmit={handleSubmit(onRegisterForm)}>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear cuenta
              </Typography>
              <Chip
                  label={showError}
                  color='error'
                  icon={<ErrorOutline />}
                  className='fadeIn'
                  sx={{ display: !!showError ? 'flex' : 'none', width: '100%', mt: 1}}
                />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("name", {
                  required: "Campo requerido",
                  minLength: {value: 2, message: "Mínimo 2 caracteres"}
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                label="Name"
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("email", {
                  required: "Campo requerido",
                  validate: validations.isEmail
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                label="Correo"
                type="email"
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("password", {
                  required: "Campo requerido",
                  minLength: {value: 6, message: "Mínimo 6 caracteres"}
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' className="btn" color="secondary" size="large" fullWidth>
                Crear
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end">
              <NextLink href={`/auth/login?p=${router.query.p?.toString() || router.query.callbackUrl?.toString() || '/'}`} passHref>
                <Link color="#000" underline="always">
                  ¿Ya tienes una cuenta?
                </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

  const session = await getSession({req})
  const callbackUrl = query.callbackUrl?.toString();
  const place = query.p?.toString(); 

  if (session) {
    return {
      redirect: {
        destination: callbackUrl || place || '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default RegisterPage;
