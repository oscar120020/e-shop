import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { ValidSizes } from "../../interfaces";

interface Props {
  sizes: ValidSizes[];
  selectedSize?: ValidSizes;
  onSelectSize: (size: ValidSizes) => void;
}

export const SizeSelector = ({ sizes, selectedSize, onSelectSize }: Props) => {
  return (
    <Box>
      {sizes.map((size) => (
        <Button
          color={selectedSize === size ? "info" : "primary"}
          size="small"
          key={size}
          onClick={() => onSelectSize(size)}
        >
          {size}
        </Button>
      ))}
    </Box>
  );
};
