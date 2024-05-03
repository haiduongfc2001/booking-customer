import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const NoBookings = () => {
  return (
    <Box pt={2}>
      <Box
        sx={{
          m: "32px 0 32px !important",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Image
          src="https://img.freepik.com/free-vector/flat-hotel-booking-concept-background_23-2148147581.jpg"
          alt="no-hotels"
          width="249"
          height="210"
          loading="lazy"
        />
        <Typography variant="h6" sx={{ pb: 2 }}>
          Chưa có đơn đặt phòng nào
        </Typography>
        <Button variant="contained" color="primary">
          <Link href="/">Tìm kiếm</Link>
        </Button>
      </Box>
    </Box>
  );
};

export default NoBookings;
