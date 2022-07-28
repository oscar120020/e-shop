import NextLink from "next/link";
import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useRouter } from "next/router";
import { CartContext, UIContext } from "../../context";
import { useContext, useState } from "react";
import { ClearOutlined, SearchOutlined } from "@mui/icons-material";

export const Navbar = () => {
  const { pathname, push } = useRouter();
  const { toggleSideMenu } = useContext(UIContext);
  const { orderSummary } = useContext(CartContext);
  const { numberOfItems } = orderSummary;

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const onSendSearch = () => {
    if(searchTerm.length === 0) return;
    push(`/search/${searchTerm}`);
    setIsSearching(false)
  }



  return (
    <AppBar>
      <Toolbar>
        <NextLink href={"/"} passHref>
          <Link display="flex" alignItems="center">
            <Typography color="black" variant="h6" align="center">
              Teslo |
            </Typography>
            <Typography color="black" align="center" sx={{ marginLeft: 0.5 }}>
              Shop
            </Typography>
          </Link>
        </NextLink>

        <Box flex={1} />

        <Box className="fadeIn" sx={{ display: { xs: "none", sm: isSearching ? 'none' : "flex", md: 'flex' } }}>
          <NextLink href={"/category/men"} passHref>
            <Link display="flex" alignItems="center">
              <Button
                className={pathname === "/category/men" ? "btn" : ""}
                color={pathname === "/category/men" ? "info" : "primary"}
              >
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/women"} passHref>
            <Link display="flex" alignItems="center">
              <Button
                className={pathname === "/category/women" ? "btn" : ""}
                color={pathname === "/category/women" ? "info" : "primary"}
              >
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href={"/category/kid"} passHref>
            <Link display="flex" alignItems="center">
              <Button
                className={pathname === "/category/kid" ? "btn" : ""}
                color={pathname === "/category/kid" ? "info" : "primary"}
              >
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>

        <Box flex={1} />
        {
          isSearching ? (
            <Input
              className='fadeIn'
              sx={{display: {xs: 'none', sm: 'flex'}}}
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && onSendSearch()}
              type="text"
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setIsSearching(false)}>
                    <ClearOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          ) : (
            <IconButton
              className='fadeIn'
              sx={{display: {xs: 'none', sm: 'flex'}}}
              onClick={() => setIsSearching(true)}
            >
              <SearchIcon />
            </IconButton>
          )
        }

        <IconButton
          sx={{display: {xs: 'flex', sm: 'none'}}}
          onClick={toggleSideMenu}
        >
          <SearchIcon />
        </IconButton>

        <NextLink href={"/cart"} passHref>
          <Link>
            <IconButton>
              <Badge 
                badgeContent={numberOfItems > 9 ? `+9`: numberOfItems} 
                color="secondary"
              >
                <ShoppingCartOutlinedIcon />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>

        <Button onClick={toggleSideMenu} >Menú</Button>
      </Toolbar>
    </AppBar>
  );
};
