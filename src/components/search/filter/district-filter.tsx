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
import { useAppDispatch } from "@/redux/store/store";
import { getRequest } from "@/services/api-instance";
import { STATUS_CODE } from "@/constant/constants";

interface District {
  id: string;
  name: string;
}

interface DistrictFilterProps {
  location: string;
  selectedDistrict: string;
  onChangeDistrict: (newDistrict: string) => void;
}

const DistrictFilter: React.FC<DistrictFilterProps> = ({
  location,
  selectedDistrict,
  onChangeDistrict,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [districtsList, setDistrictsList] = useState<District[]>([]);
  const dispatch = useAppDispatch();
  // const initialLoad = React.useRef(true);

  const fetchDistrictsList = async () => {
    if (!location) return;
    try {
      const response = await getRequest(
        `/address/getAllDistricts?location=${location}`
      );

      if (response?.status === STATUS_CODE.OK) {
        setDistrictsList(response.data);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  React.useEffect(() => {
    // if (initialLoad.current) {
    //   initialLoad.current = false;
    //   return;
    // }
    fetchDistrictsList();
  }, [location]);

  const handleDistrictChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeDistrict(event.target.value);
  };

  const visibleDistricts = showAll ? districtsList : districtsList.slice(0, 5);

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
        <Typography id="district-radio-group" variant="h6" gutterBottom mb={0}>
          Địa điểm
        </Typography>
        {selectedDistrict && (
          <Button
            color="error"
            sx={{ p: 0 }}
            onClick={() => onChangeDistrict("")}
          >
            Xóa
          </Button>
        )}
      </Box>

      <RadioGroup
        aria-label="district"
        name="district"
        value={selectedDistrict}
        onChange={handleDistrictChange}
      >
        {visibleDistricts?.map((district) => (
          <FormControlLabel
            key={district.name}
            value={district.name}
            control={<Radio />}
            label={district.name} // Hiển thị tên của district
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
      {districtsList.length > 5 && (
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

export default DistrictFilter;
