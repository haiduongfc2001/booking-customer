import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const NoHotels = () => {
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
          src="https://static.vecteezy.com/system/resources/previews/015/694/767/original/skyscraper-hotel-building-flat-cartoon-hand-drawn-illustration-template-with-view-on-city-space-of-street-panorama-design-vector.jpg"
          alt="no-hotels"
          width="249"
          height="210"
          loading="lazy"
        />
        <Typography variant="h6" sx={{ pb: 2 }}>
          Chưa có khách sạn yêu thích
        </Typography>
        <Button variant="contained" color="primary">
          <Link href="/">Tìm kiếm</Link>
        </Button>
      </Box>
    </Box>
  );
};

export default NoHotels;
