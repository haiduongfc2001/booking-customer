"use client";
import * as React from "react";
import { Box, List, ListItem, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/search-hotel";
import dayjs from "dayjs";

export default function Search() {
  const searchParams = useSearchParams();

  const location: string = searchParams.get("location") || "";
  const checkInDate: string =
    searchParams.get("checkInDate") || dayjs().format("YYYY-MM-DD");
  const checkOutDate: string =
    searchParams.get("checkOutDate") || dayjs().format("YYYY-MM-DD");
  const numberOfPeople: number =
    Number(searchParams.get("numberOfPeople")) || 1;
  const numberOfRooms: number = Number(searchParams.get("numberOfRooms")) || 1;

  return (
    <>
      <Box
        sx={{
          color: "#1a202c",
          my: 4,
          mx: 2,
          position: "relative",
          fontSize: "14px",
          fontWeight: "normal",
          lineHeight: "17px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SearchBar
          location={location}
          checkInDate={dayjs(checkInDate)}
          checkOutDate={dayjs(checkOutDate)}
          numberOfPeople={numberOfPeople}
          numberOfRooms={numberOfRooms}
        />
      </Box>
    </>
  );
}
