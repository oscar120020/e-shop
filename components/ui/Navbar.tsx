import NextLink from "next/link";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

export const Navbar = () => {
  return (
    <AppBar>
      <Toolbar>
        <NextLink href={"/"} passHref>
          <Link display="flex" alignItems="center">
            <Typography color="black" variant="h6" align="center" >
              Teslo |
            </Typography>
            <Typography color="black" align="center" sx={{ marginLeft: 0.5 }}>
              Shop
            </Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box sx={{display: {xs: 'none', sm: 'flex'}}} >
          <NextLink href={"/category/men"} passHref>
            <Link display="flex" alignItems="center">
              <Button>Hombres</Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/women"} passHref>
            <Link display="flex" alignItems="center">
              <Button>Mujeres</Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/kid"} passHref>
            <Link display="flex" alignItems="center">
              <Button>Niños</Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />

        <IconButton>
          <SearchIcon />
        </IconButton>

        <NextLink href={"/cart"} passHref>
          <Link>
            <IconButton>
              <Badge badgeContent={1} color="secondary">
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button>Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
