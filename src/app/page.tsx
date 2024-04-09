"use client";
// import MapComponent from "@/components/map/map";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, Button, CardMedia, Grid, TextField } from "@mui/material";
import { Metadata } from "next";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import SearchBar from "@/components/home/search";

const metadata: Metadata = {
  title: "DHD | Home",
  description: "The official Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function Home() {
  return (
    <>
      <Box
        sx={{
          color: "#1a202c",
          height: "460px",
          position: "relative",
          fontSize: "14px",
          fontWeight: "normal",
          lineHeight: "17px",
        }}
      >
        <CardMedia
          component="img"
          src="https://www.usatoday.com/gcdn/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg"
          alt="hotel"
          sx={{
            width: "100%",
            height: 460,
            objectFit: "cover",
            mb: 2,
            mr: 2,
          }}
        />

        <SearchBar />
      </Box>
      {/* <MapComponent /> */}
    </>
  );
}
