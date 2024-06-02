"use client";
import * as React from "react";
import { Box, Button } from "@mui/material";
import SearchBar from "@/components/search/search-hotel";
import dayjs from "dayjs";
import SearchResult from "@/components/search/search-result";
import PriceFilter from "@/components/search/filter/filter-hotel";
import { API, FILTER, STATUS_CODE } from "@/constant/constants";
import AmenitiesFilter from "@/components/search/filter/amenities-filter";
import RoomTypeFilter from "@/components/search/filter/room-type-filter";
import RatingFilter from "@/components/search/filter/rating-filter";
import { postRequest } from "@/services/api-instance";

export default function Search(props: any) {
  const [priceRange, setPriceRange] = React.useState<number[]>([
    FILTER.PRICE.MIN,
    FILTER.PRICE.MAX,
  ]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>(
    []
  );
  const [selectedRoomType, setSelectedRoomType] = React.useState<string[]>([]);
  const [selectedMinRating, setSelectedMinRating] = React.useState<string>("");
  const [hotelSearchResults, setHotelSearchResults] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    location = "",
    checkIn = dayjs().format("YYYY-MM-DD"),
    checkOut = dayjs(checkIn).add(1, "day").format("YYYY-MM-DD"),
    numRooms = 1,
    numAdults = 1,
  } = props.searchParams;

  React.useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      setError(null);

      const body = {
        location,
        check_in: checkIn,
        check_out: checkOut,
        num_adults: numAdults,
        num_children: 0,
        num_rooms: numRooms,
        filters: {
          price_range: priceRange,
          amenities: selectedAmenities,
          room_type: selectedRoomType,
          min_rating: selectedMinRating,
        },
      };

      try {
        const response = await postRequest(API.SEARCH.SEARCH_HOTEL, body);

        if (response && response?.status === STATUS_CODE.OK) {
          setHotelSearchResults(response.data);
        }
      } catch (error: any) {
        console.error(error.response?.data?.message || error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotels();
  }, [
    location,
    checkIn,
    checkOut,
    numAdults,
    numRooms,
    priceRange,
    selectedAmenities,
    selectedRoomType,
    selectedMinRating,
  ]);

  const handleFilterHotel = () => {
    console.log({
      location,
      checkIn,
      checkOut,
      numRooms,
      numAdults,
      priceRange,
      selectedAmenities,
      selectedRoomType,
      minRating: selectedMinRating,
      hotelSearchResults,
    });
  };

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
          checkIn={dayjs(checkIn)}
          checkOut={dayjs(checkOut)}
          numAdults={numAdults}
          numRooms={numRooms}
        />
      </Box>
      <Box sx={{ display: "flex", px: 2, mb: 4 }}>
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
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : hotelSearchResults?.items?.length > 0 ? (
          <SearchResult
            location={location}
            checkIn={dayjs(checkIn)}
            checkOut={dayjs(checkOut)}
            numAdults={numAdults}
            numRooms={numRooms}
            hotelSearchResults={hotelSearchResults}
          />
        ) : (
          <div>Không có khách sạn nào thỏa mãn yêu cầu của quý khách!</div>
        )}
      </Box>
    </>
  );
}
