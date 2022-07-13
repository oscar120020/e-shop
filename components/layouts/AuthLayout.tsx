import { Box } from "@mui/material";
import Head from "next/head";

interface Props {
  title: string;
  children: JSX.Element | JSX.Element[];
}

export const AuthLayout = ({ title, children }: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          {children}
        </Box>
      </main>
    </>
  );
};
