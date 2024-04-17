"use client";
import * as React from "react";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/search-hotel";
import dayjs from "dayjs";
import SearchResult from "@/components/search/search-result";

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
      <React.Suspense fallback={null}>
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
        <Box sx={{ display: "flex" }}>
          {/* Sidebar for filters */}
          <Box
            sx={{
              flex: "0 0 25%",
              borderRight: "1px solid #ccc",
              padding: "0 20px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            {/* Add filter components here */}
            {/* Example: <FilterComponent /> */}
          </Box>

          {/* Main section for hotel display */}
          <SearchResult location={location} />
        </Box>
      </React.Suspense>
    </>
  );
}
