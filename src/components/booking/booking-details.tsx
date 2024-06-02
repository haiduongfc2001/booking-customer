import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Image from "next/image";
import dayjs from "dayjs";
import { FALLBACK_URL } from "@/constant/constants";

interface Hotel {
  [key: string]: any;
}

interface RoomBooking {
  name: string;
}

interface Booking {
  [key: string]: any;
  hotel: Hotel;
}

interface BookingDetailsProps {
  booking: Booking;
  numNights: number;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  booking,
  numNights,
}) => {
  const hotelAvatar =
    booking?.hotel?.hotelImages?.find(
      (image: { is_primary: boolean }) => image.is_primary
    )?.url || FALLBACK_URL.HOTEL_NO_IMAGE;

  const checkInTime = booking?.hotel?.policies?.find(
    (policy: { type: string }) => policy.type === "CHECK_IN_TIME"
  )?.value;

  const checkOutTime = booking?.hotel?.policies?.find(
    (policy: { type: string }) => policy.type === "CHECK_OUT_TIME"
  )?.value;

  return (
    <Box sx={{ bgcolor: "neutral.200", p: 2, mb: 2, borderRadius: 1 }}>
      <Box display="flex">
        <div
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            width: "64px",
            height: "64px",
          }}
        >
          <Image
            priority
            src={hotelAvatar}
            alt={booking?.hotel?.name}
            width="64"
            height="64"
            // loading="lazy"
          />
        </div>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          ml={2}
        >
          <Typography variant="h6">{booking?.hotel?.name}</Typography>
          <Typography variant="body2">{booking?.hotel?.address}</Typography>
        </Box>
      </Box>

      <Box my={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              bgcolor="background.paper"
              p={1}
              borderRadius={1}
            >
              <Typography variant="subtitle1">Nhận phòng</Typography>
              <Typography variant="body2">
                {checkInTime} &nbsp;{" "}
                {dayjs(booking?.check_in).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              bgcolor="background.paper"
              p={1}
              borderRadius={1}
            >
              <Typography variant="subtitle1">Trả phòng</Typography>
              <Typography variant="body2">
                {checkOutTime} &nbsp;{" "}
                {dayjs(booking?.check_out).format("DD-MM-YYYY")}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              display="flex"
              flexDirection="column"
              bgcolor="background.paper"
              p={1}
              borderRadius={1}
            >
              <Typography variant="subtitle1">Số đêm</Typography>
              <Typography variant="body2">{numNights}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box display="flex" flexDirection="column">
        <Typography variant="subtitle1">Số phòng</Typography>
        <Box display="flex">
          <Typography
            variant="body2"
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            {booking?.num_rooms} x&nbsp;
          </Typography>
          <Typography variant="body2">
            {booking?.hotel?.roomTypes?.name}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingDetails;
