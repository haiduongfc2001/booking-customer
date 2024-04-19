import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React from "react";

const ratingList = [
  {
    value: "4.5",
    label: "Tuyệt vời (4.5+)",
  },
  {
    value: "4.0",
    label: "Xuất sắc (4.0+)",
  },
  {
    value: "3.5",
    label: "Rất tốt (3.5+)",
  },
  {
    value: "3.0",
    label: "Hài lòng (3.0+)",
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
        <Typography id="rating-radio-group" variant="h6" gutterBottom>
          Đánh giá của khách
        </Typography>
        {selectedMinRating && (
          <Button
            color="secondary"
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
        {ratingList.map((rating) => (
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
