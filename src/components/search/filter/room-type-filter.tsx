import {
  FormControlLabel,
  Box,
  Typography,
  Button,
  Checkbox,
  FormGroup,
} from "@mui/material";
import React from "react";

interface RoomTypeFilterProps {
  selectedRoomType: string[];
  onRoomTypeChange: (roomType: string[]) => void;
}

const RoomTypeFilter: React.FC<RoomTypeFilterProps> = ({
  selectedRoomType,
  onRoomTypeChange,
}) => {
  const handleRoomTypeChange = (roomType: string) => {
    const updatedRoomType = selectedRoomType.includes(roomType)
      ? selectedRoomType.filter((item) => item !== roomType)
      : [...selectedRoomType, roomType];
    onRoomTypeChange(updatedRoomType);
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
        <Typography id="room-type-filter" variant="h6" gutterBottom mb={0}>
          Loại phòng
        </Typography>
        {selectedRoomType?.length > 0 && (
          <Button color="error" onClick={() => onRoomTypeChange([])}>
            Xóa
          </Button>
        )}
      </Box>

      <FormGroup>
        {roomTypes.map((type) => (
          <FormControlLabel
            key={type}
            control={
              <Checkbox
                checked={selectedRoomType.includes(type)}
                onChange={() => handleRoomTypeChange(type)}
              />
            }
            label={type}
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

export default RoomTypeFilter;

// Danh sách các loại phòng
const roomTypes: string[] = ["Phòng đơn", "Phòng đôi", "Suite"];
