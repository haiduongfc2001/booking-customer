"use client";
// import MapComponent from "@/components/map/map";
import * as React from "react";
import { Box, CardMedia } from "@mui/material";
import SearchBar from "@/components/home/search";
import OutstandingHotel from "@/components/home/outstanding-hotel";
import Provinces from "@/components/home/province-card";
import { AppDispatch, useAppDispatch } from "@/redux/store/store";
import { closeLoadingApi } from "@/redux/slices/loading-slice";

export default function Home() {
  const dispatch: AppDispatch = useAppDispatch();
  dispatch(closeLoadingApi());
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
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
          }}
        />

        <Box
          sx={{
            width: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: "8px 24px",
            borderRadius: "8px",
            boxShadow: "0px 12px 12px 0px rgba(0, 0, 0, 0.10)",
            maxWidth: "1188px",
          }}
        >
          <SearchBar />
        </Box>
      </Box>
      <OutstandingHotel />
      <Provinces />
    </>
  );
}
