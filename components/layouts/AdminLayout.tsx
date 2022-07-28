
import { Box, Typography } from '@mui/material';
import Head from 'next/head';
import { AdminNavbar } from '../admin';
import { SideMenu } from '../ui';

interface Props {
    title: string;
    subTitle: string;
    icon?: JSX.Element;
    children: JSX.Element | JSX.Element[];
}

export const AdminLayout = ({title, children, subTitle, icon}: Props) => {
  return (
    <>
        <Head>
            <title>Teslo Shop</title>
        </Head>
        <nav>
            <AdminNavbar/>
        </nav>

        <SideMenu/>

        <main style={{
            margin: "80px auto",
            maxWidth: 1440,
            padding: "0px 30px"
        }} >

            <Box display='flex' flexDirection='column' >
                <Typography variant='h1' component='h1' sx={{display: 'flex', alignItems: 'center'}} >
                    { icon }&nbsp;{ title }
                </Typography>
                <Typography variant='h2' sx={{mb:1}} >{ subTitle }</Typography>
            </Box>
            <Box className='fadeIn' >
                { children }
            </Box>
        </main>
        
    </>
  )
}