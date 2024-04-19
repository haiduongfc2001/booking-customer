import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";

interface IAmenitiesFilterProps {
  selectedAmenities: string[];
  onAmenitiesChange: (newAmenities: string[]) => void;
}

const amenitiesList: string[] = [
  "Bể bơi",
  "Phòng gym",
  "Spa",
  "Nhà hàng",
  "Wifi miễn phí",
];

const AmenitiesFilter: React.FC<IAmenitiesFilterProps> = ({
  selectedAmenities,
  onAmenitiesChange,
}) => {
  const handleAmenitiesChange = (amenity: string) => {
    const updatedAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((item) => item !== amenity)
      : [...selectedAmenities, amenity];
    onAmenitiesChange(updatedAmenities);
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
        <Typography id="amenities-filter" variant="h6" gutterBottom>
          Tiện nghi
        </Typography>
        {selectedAmenities?.length > 0 && (
          <Button color="secondary" onClick={() => onAmenitiesChange([])}>
            Xóa
          </Button>
        )}
      </Box>
      <FormGroup>
        {amenitiesList.map((amenity) => (
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
    </Box>
  );
};

export default AmenitiesFilter;
