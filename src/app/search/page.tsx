"use client";
import * as React from "react";
import { Box, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/search-hotel";
import dayjs from "dayjs";
import SearchResult from "@/components/search/search-result";
import FilterComponent from "@/components/search/filter-hotel";
import { FILTER } from "@/constant/constants";

export default function Search() {
  const [priceRange, setPriceRange] = React.useState<number[]>([
    FILTER.PRICE.MIN,
    FILTER.PRICE.MAX,
  ]);
  const searchParams = useSearchParams();

  const location: string = searchParams.get("location") || "";
  const checkInDate: string =
    searchParams.get("checkInDate") || dayjs().format("YYYY-MM-DD");
  const checkOutDate: string =
    searchParams.get("checkOutDate") || dayjs().format("YYYY-MM-DD");
  const numberOfPeople: number =
    Number(searchParams.get("numberOfPeople")) || 1;
  const numberOfRooms: number = Number(searchParams.get("numberOfRooms")) || 1;

  const handlePriceRangeChange = (newValue: number[]) => {
    setPriceRange(newValue); // Cập nhật giá trị khoảng giá mới
    // Thực hiện các hành động khác tại đây nếu cần thiết
  };

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
            <FilterComponent onChangePriceRange={handlePriceRangeChange} />
          </Box>

          {/* Main section for hotel display */}
          <SearchResult location={location} />
        </Box>
      </React.Suspense>
    </>
  );
}
