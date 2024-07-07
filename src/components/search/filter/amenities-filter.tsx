import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface IAmenitiesFilterProps {
  selectedAmenities: string[];
  onAmenitiesChange: (newAmenities: string[]) => void;
}

const amenitiesList: string[] = [
  "Wi-Fi miễn phí",
  "Bể bơi",
  "Bãi đỗ xe",
  "Nhà hàng",
  "Phòng tập thể dục",
  "Dịch vụ phòng 24 giờ",
  "Spa",
  "Điều hòa không khí",
  "Truyền hình cáp/vệ tinh",
  "Dịch vụ giặt là",
];

const AmenitiesFilter: React.FC<IAmenitiesFilterProps> = ({
  selectedAmenities,
  onAmenitiesChange,
}) => {
  const [showAll, setShowAll] = useState(false);

  const handleAmenitiesChange = (amenity: string) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((item) => item !== amenity)
      : [...selectedAmenities, amenity];
    onAmenitiesChange(updatedAmenities);
  };

  const visibleAmenities = showAll ? amenitiesList : amenitiesList.slice(0, 5);

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
        <Typography id="amenities-filter" variant="h6" gutterBottom mb={0}>
          Tiện nghi
        </Typography>
        {selectedAmenities?.length > 0 && (
          <Button color="error" onClick={() => onAmenitiesChange([])}>
            Xóa
          </Button>
        )}
      </Box>
      <FormGroup>
        {visibleAmenities.map((amenity) => (
          <FormControlLabel
            key={amenity}
            control={
              <Checkbox
                checked={selectedAmenities.includes(amenity)}
                onChange={() => handleAmenitiesChange(amenity)}
              />
            }
            label={amenity}
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
      </FormGroup>
      {amenitiesList.length > 5 && (
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

export default AmenitiesFilter;
