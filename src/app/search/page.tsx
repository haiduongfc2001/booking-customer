"use client";
import * as React from "react";
import { Box, Button } from "@mui/material";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/search-hotel";
import dayjs from "dayjs";
import SearchResult from "@/components/search/search-result";
import PriceFilter from "@/components/search/filter/filter-hotel";
import { FILTER } from "@/constant/constants";
import AmenitiesFilter from "@/components/search/filter/amenities-filter";
import RoomTypeFilter from "@/components/search/filter/room-type-filter";
import RatingFilter from "@/components/search/filter/rating-filter";

export default function Search() {
  const [priceRange, setPriceRange] = React.useState<number[]>([
    FILTER.PRICE.MIN,
    FILTER.PRICE.MAX,
  ]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>(
    []
  );
  const [selectedRoomType, setSelectedRoomType] = React.useState<string[]>([]);
  const [selectedMinRating, setSelectedMinRating] = React.useState<string>("");

  const searchParams = useSearchParams();
  const checkInDateParam = searchParams.get("checkInDate");
  const checkOutDateParam = searchParams.get("checkOutDate");

  const location: string = searchParams.get("location") || "";
  // Parse checkInDate from query parameter or use today's date as fallback
  const checkInDate = checkInDateParam || dayjs().format("YYYY-MM-DD");
  // Calculate checkOutDate based on checkInDate
  const checkOutDate = checkOutDateParam
    ? dayjs(checkOutDateParam).isAfter(checkInDate)
      ? checkOutDateParam
      : dayjs(checkInDate).add(1, "day").format("YYYY-MM-DD")
    : dayjs(checkInDate).add(1, "day").format("YYYY-MM-DD");
  const numberOfPeople: number =
    Number(searchParams.get("numberOfPeople")) || 1;
  const numberOfRooms: number = Number(searchParams.get("numberOfRooms")) || 1;

  const handlePriceRangeChange = (newPriceRange: number[]) => {
    setPriceRange((prevState) => {
      if (newPriceRange.length === 2) {
        return [
          Math.min(newPriceRange[0], prevState[1] - FILTER.PRICE.STEP),
          Math.max(newPriceRange[1], prevState[0] + FILTER.PRICE.STEP),
        ];
      }
      return prevState;
    });
  };

  const handleAmenitiesChange = (newAmenities: string[]) => {
    setSelectedAmenities(newAmenities);
  };

  const handleRoomTypeChange = (newRoomType: string[]) => {
    setSelectedRoomType(newRoomType);
  };

  const handleRatingChange = (newMinRating: string) => {
    setSelectedMinRating(newMinRating);
  };

  const handleFilterHotel = () => {
    console.log({
      priceRange,
      selectedAmenities,
      selectedRoomType,
      minRating: selectedMinRating,
    });
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
        <Box sx={{ display: "flex", px: 2 }}>
          {/* Sidebar for filters */}
          <Box
            sx={{
              flex: "0 0 25%",
              borderRight: "1px solid #ccc",
              padding: "0 20px",
            }}
          >
            <PriceFilter
              priceRange={priceRange}
              onChangePriceRange={handlePriceRangeChange}
            />
            <AmenitiesFilter
              selectedAmenities={selectedAmenities}
              onAmenitiesChange={handleAmenitiesChange}
            />
            <RoomTypeFilter
              selectedRoomType={selectedRoomType}
              onRoomTypeChange={handleRoomTypeChange}
            />
            <RatingFilter
              selectedMinRating={selectedMinRating}
              onChangeRating={handleRatingChange}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              onClick={handleFilterHotel}
            >
              Lọc
            </Button>
          </Box>

          {/* Main section for hotel display */}
          <SearchResult
            location={location}
            checkInDate={dayjs(checkInDate)}
            checkOutDate={dayjs(checkOutDate)}
            numberOfPeople={numberOfPeople}
            numberOfRooms={numberOfRooms}
          />
        </Box>
      </React.Suspense>
    </>
  );
}
