import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import Image from "next/image";

interface Hotel {
  thumbnail: { src: string };
  name: string;
  address: { address: string };
  checkInTime: string;
  checkOutTime: string;
}

interface RoomBooking {
  name: string;
}

interface Booking {
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  numRooms: number;
  roomBookings: RoomBooking[];
}

interface BookingDetailsProps {
  booking: Booking;
  numNights: number;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  booking,
  numNights,
}) => {
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
            src={booking?.hotel.thumbnail.src}
            alt={booking?.hotel.name}
            width="64"
            height="64"
            loading="lazy"
          />
        </div>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="flex-start"
          ml={2}
        >
          <Typography variant="h6">{booking?.hotel.name}</Typography>
          <Typography variant="body2">
            {booking?.hotel.address.address}
          </Typography>
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
                {booking?.hotel.checkInTime} &nbsp; {booking?.checkIn}
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
                {booking?.hotel.checkOutTime} &nbsp; {booking?.checkOut}
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
            {booking?.numRooms} x&nbsp;
          </Typography>
          <Typography variant="body2">
            {booking?.roomBookings[0].name}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingDetails;
