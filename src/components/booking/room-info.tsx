import React from "react";
import { Box, Typography, SvgIcon, List, ListItem } from "@mui/material";
import Image from "next/image";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import BreakfastIcon from "@mui/icons-material/BreakfastDining";
import ConfirmIcon from "@mui/icons-material/CheckCircleOutline";
import { BankTransferIcon } from "@/constant/icons";

interface RoomRate {
  shortCancelPolicy: string;
  freeBreakfast: boolean;
}

interface RoomInfo {
  thumbnail: string;
  name: string;
  maxGuests: number;
  maxOccupant: number;
  maxChildren: number;
  views: string[];
  rates: RoomRate[];
}

interface RoomBooking {
  bedTypes: string[];
}

interface Booking {
  roomBookings: RoomBooking[];
}

interface RoomInfoProps {
  roomInfo: RoomInfo;
  booking: Booking;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomInfo, booking }) => {
  return (
    <Box sx={{ bgcolor: "neutral.200", p: 2, mb: 2, borderRadius: 1 }}>
      <Typography variant="h6" mb={2}>
        Thông tin phòng
      </Typography>
      <div
        style={{
          width: "100%",
          height: "200px",
          position: "relative",
        }}
      >
        <Image
          src={roomInfo?.thumbnail}
          alt={roomInfo?.name}
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "100%",
            borderRadius: "8px",
          }}
        />
      </div>
      <Typography variant="h6" mt={2} mb={1}>
        {roomInfo?.name}
      </Typography>

      <Box>
        <Box display="flex">
          <SvgIcon>
            <PeopleOutlineOutlinedIcon />
          </SvgIcon>
          <Typography variant="subtitle2" sx={{ ml: 1 }}>
            {roomInfo?.maxGuests} người lớn
          </Typography>
        </Box>

        <Box sx={{ ml: 2 }}>
          <List sx={{ listStyleType: "disc", ml: 2 }}>
            <ListItem
              sx={{
                display: "list-item",
                p: 0.5,
                "&::marker": { color: "neutral.900" },
              }}
            >
              Sức chứa tối đa của phòng {roomInfo?.maxOccupant}
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                p: 0.5,
                "&::marker": { color: "neutral.900" },
              }}
            >
              Số khách tiêu chuẩn {roomInfo?.maxGuests}
            </ListItem>
            <ListItem
              sx={{
                display: "list-item",
                p: 0.5,
                "&::marker": { color: "neutral.900" },
              }}
            >
              Cho phép ở thêm {roomInfo?.maxChildren} trẻ em thỏa mãn{" "}
              {roomInfo?.maxOccupant} khách tối đa có thể mất thêm phí
            </ListItem>
          </List>
        </Box>
      </Box>
      <Box display="flex" my={1}>
        <SvgIcon>
          <VisibilityOutlinedIcon />
        </SvgIcon>
        <Typography variant="subtitle2" sx={{ ml: 1 }}>
          {roomInfo?.views}
        </Typography>
      </Box>
      <Box display="flex" my={1}>
        <SvgIcon>
          <SingleBedIcon />
        </SvgIcon>
        <Typography variant="subtitle2" sx={{ ml: 1 }}>
          {booking?.roomBookings[0].bedTypes}
        </Typography>
      </Box>
      <Box display="flex" my={1}>
        <SvgIcon>
          <BankTransferIcon />
        </SvgIcon>
        <Typography variant="subtitle2" sx={{ ml: 1 }}>
          {roomInfo?.rates[0].shortCancelPolicy}
        </Typography>
      </Box>
      <Box display="flex" my={1}>
        <SvgIcon>
          <BreakfastIcon />
        </SvgIcon>
        <Typography
          variant="subtitle2"
          sx={{
            ml: 1,
            color: roomInfo?.rates[0].freeBreakfast
              ? "success.main"
              : "neutral.900",
          }}
        >
          {roomInfo?.rates[0].freeBreakfast
            ? "Bao gồm bữa ăn sáng"
            : "Không bao gồm bữa ăn sáng"}
        </Typography>
      </Box>
      <Box display="flex" my={1}>
        <SvgIcon>
          <ConfirmIcon />
        </SvgIcon>
        <Typography variant="subtitle2" sx={{ ml: 1, color: "warning.main" }}>
          Xác nhận ngay
        </Typography>
      </Box>
    </Box>
  );
};

export default RoomInfo;
