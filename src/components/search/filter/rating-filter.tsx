import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";

const ratingCategories = [
  {
    value: "9.0",
    label: "Tuyệt vời (9.0+)",
  },
  {
    value: "8.0",
    label: "Rất tốt (8.0+)",
  },
  {
    value: "7.0",
    label: "Tốt (7.0+)",
  },
  {
    value: "6.0",
    label: "Hài lòng (6.0+)",
  },
];

interface RatingFilterProps {
  selectedMinRating: string;
  onChangeRating: (newMinRating: string) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  selectedMinRating,
  onChangeRating,
}) => {
  const handleMinRatingChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChangeRating(event.target.value);
  };

  return (
    <Box mt={4}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography id="rating-radio-group" variant="h6" gutterBottom mb={0}>
          Đánh giá của khách
        </Typography>
        {selectedMinRating && (
          <Button
            color="error"
            sx={{ p: 0 }}
            onClick={() => onChangeRating("")}
          >
            Xóa
          </Button>
        )}
      </Box>

      <RadioGroup
        aria-label="rating"
        name="rating"
        value={selectedMinRating}
        onChange={handleMinRatingChange}
      >
        {ratingCategories.map((rating) => (
          <FormControlLabel
            key={rating.value}
            value={rating.value}
            control={<Radio />}
            label={rating.label}
            sx={{
              "&:hover": {
                ".MuiTypography-root, .MuiButtonBase-root": {
                  color: (theme) => theme.palette.primary.main,
                  transition: "color 0.2s ease",
                },
              },
            }}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default RatingFilter;
