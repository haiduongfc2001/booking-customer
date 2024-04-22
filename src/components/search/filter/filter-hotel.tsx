import * as React from "react";
import {
  Box,
  Grid,
  Slider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import formatCurrency from "@/utils/format-currency";
import { FILTER } from "@/constant/constants";
import { styled } from "@mui/material/styles";
import RemoveIcon from "@mui/icons-material/Remove";

const PriceRangeSlider = styled(Slider)({
  color: "#52af77",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    borderRadius: "8px",
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: "2px 4px",
    width: "auto",
    height: 28,
    backgroundColor: "#52af77",
    // borderRadius: "50% 50% 50% 0",
    // transformOrigin: "bottom left",
    // transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    // "&.MuiSlider-valueLabelOpen": {
    //   transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    // },
    // "& > *": {
    //   transform: "rotate(45deg)",
    // },
  },
});

function valueLabelFormat(value: number) {
  if (value === FILTER.PRICE.MAX) {
    return "Không giới hạn";
  }

  return formatCurrency(value);
}

interface PriceFilterProps {
  priceRange: number[];
  onChangePriceRange: (value: number[]) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  onChangePriceRange,
}) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box>
      <Typography id="filter-hotel" variant="h6" gutterBottom>
        Giá mỗi đêm
      </Typography>
      <PriceRangeSlider
        marks
        valueLabelDisplay="auto"
        sx={{
          mt: 3,
        }}
        min={FILTER.PRICE.MIN}
        max={FILTER.PRICE.MAX}
        step={FILTER.PRICE.STEP}
        value={priceRange}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        onChange={(event, newPriceRange) =>
          onChangePriceRange(newPriceRange as number[])
        }
      />
      <Grid container mt={1}>
        <Grid
          item
          xs={12}
          lg={5.5}
          sx={{
            p: "8px !important",
            bgcolor: "background.paper",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Thấp nhất</Typography>
          <Typography variant="subtitle2">
            {formatCurrency(priceRange[0])}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          lg={1}
          sx={{
            p: "8px !important",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transform: isLgUp ? "none" : "rotate(90deg)",
          }}
        >
          <RemoveIcon />
        </Grid>
        <Grid
          item
          xs={12}
          lg={5.5}
          sx={{
            p: "8px !important",
            bgcolor: "background.paper",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Cao nhất</Typography>
          <Typography variant="subtitle2">
            {priceRange[1] === FILTER.PRICE.MAX
              ? "Không giới hạn"
              : formatCurrency(priceRange[1])}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PriceFilter;
