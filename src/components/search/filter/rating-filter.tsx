import React, { useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const ratingCategories = [
  {
    value: 9,
    label: "Tuyệt vời (9.0+)",
  },
  {
    value: 8,
    label: "Rất tốt (8.0+)",
  },
  {
    value: 7,
    label: "Tốt (7.0+)",
  },
  {
    value: 6,
    label: "Hài lòng (6.0+)",
  },
];

interface RatingFilterProps {
  selectedMinRating: number | null;
  onChangeRating: (newMinRating: number | null) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({
  selectedMinRating,
  onChangeRating,
}) => {
  const [showAll, setShowAll] = useState(false);

  const handleMinRatingChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChangeRating(Number(event.target.value));
  };

  return (
    <Box
      mt={4}
      sx={{
        borderRadius: 1,
        bgcolor: "background.paper",
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 50,
        }}
      >
        <Typography id="rating-radio-group" variant="h6" gutterBottom mb={0}>
          Đánh giá của khách
        </Typography>
        {selectedMinRating && (
          <Button
            color="error"
            sx={{ p: 0 }}
            onClick={() => onChangeRating(null)}
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
      {ratingCategories.length > 5 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            mb: 1,
            pb: 1,
          }}
        >
          <Button
            variant="text"
            color="primary"
            onClick={() => setShowAll((prevShowAll) => !prevShowAll)}
            endIcon={showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showAll ? "Thu gọn" : "Mở rộng"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RatingFilter;
