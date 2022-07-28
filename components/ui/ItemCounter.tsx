import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { IconButton, Typography } from "@mui/material"
import { Box } from "@mui/system"

interface Props {
  counter: number;
  onQuantityChange: (value: number) => void;
  maxValue: number
}

export const ItemCounter = ({counter, maxValue, onQuantityChange}: Props) => {

  const handleClick = (value: number) => {
    const sumValue = Math.max(1, value + counter)
    const quantity = Math.min(sumValue, maxValue)

    onQuantityChange(quantity)
  }

  return (
    <Box display='flex' alignItems='center' >
        <IconButton onClick={() => handleClick(-1)}>
            <RemoveCircleOutline/>
        </IconButton>
        <Typography sx={{width: 40, textAlign: 'center'}} >{counter}</Typography>
        <IconButton onClick={() => handleClick(1)}>
            <AddCircleOutline/>
        </IconButton>
    </Box>
  )
}
