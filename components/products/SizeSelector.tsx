import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { ValidSizes } from "../../interfaces";

interface Props {
  sizes: ValidSizes[];
  selectedSize?: ValidSizes;
}

export const SizeSelector = ({ sizes, selectedSize }: Props) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button color={selectedSize === size ? 'info': 'primary'} size="small" key={size}>
          {size}
        </Button>
      ))}
    </Box>
  );
};
