import { Grid, Card, CardActionArea, CardMedia, Box, Typography, Link } from "@mui/material";
import NextLink from "next/link";
import { useState } from "react";
import { IProduct } from "../../interfaces";

interface Props { 
    product: IProduct 
}

export const ProductCard = ({ product }: Props) => {

  const [isHovered, setIsHovered] = useState(false);

  return (
    <Grid 
      item xs={6} sm={4}
      onMouseOver={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <NextLink href={"/product/slug"} passHref prefetch={false}>
          <Link>
            <CardActionArea>
              <CardMedia
                component="img"
                className="fadeIn"
                image={`products/${product.images[isHovered ? 1 : 0 ]}`}
                alt={product.title}
              />          
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>

      <Box sx={{mt: 1}} className="fadeIn" >
        <Typography fontWeight={700} >{product.title}</Typography>
        <Typography fontWeight={500} >{ `$${product.price}` }</Typography>
      </Box>
    </Grid>
  );
};
