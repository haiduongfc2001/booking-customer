"use client";
import * as React from "react";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import SearchHotel from "@/components/search/search-hotel";
import dayjs from "dayjs";
import SearchResult from "@/components/search/search-result";
import PriceFilter from "@/components/search/filter/filter-hotel";
import { API, FILTER, PAGINATION, STATUS_CODE } from "@/constant/constants";
import AmenitiesFilter from "@/components/search/filter/amenities-filter";
import RoomTypeFilter from "@/components/search/filter/room-type-filter";
import RatingFilter from "@/components/search/filter/rating-filter";
import { postRequest } from "@/services/api-instance";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import { AppDispatch } from "@/redux/store/store";
import { closeLoadingApi, openLoadingApi } from "@/redux/slices/loading-slice";
import { RootState } from "@/redux/store/store";
import Image from "next/image";
import DistrictFilter from "@/components/search/filter/district-filter";

export default function Search(props: any) {
  const [priceRange, setPriceRange] = React.useState<number[]>([
    FILTER.PRICE.MIN,
    FILTER.PRICE.MAX,
  ]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>(
    []
  );
  // const [selectedRoomType, setSelectedRoomType] = React.useState<string[]>([]);
  const [selectedMinRating, setSelectedMinRating] = React.useState<
    number | null
  >(null);
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>("");
  const [hotelSearchResults, setHotelSearchResults] = React.useState<any>();
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState<number>(PAGINATION.INITIAL_PAGE);
  const [sortOption, setSortOption] = React.useState("RELEVANT");

  const customer_id = useAppSelector(
    (state: RootState) => state.auth.customer_id
  );
  const dispatch: AppDispatch = useAppDispatch();

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const {
    location = "",
    checkIn = dayjs().add(5, "day").format("YYYY-MM-DD"),
    checkOut = dayjs(checkIn).add(6, "day").format("YYYY-MM-DD"),
    numRooms = 1,
    numAdults = 1,
    numChildren = 0,
    childrenAges = [],
  } = props.searchParams;

  const childrenAgesArray: number[] =
    childrenAges.length > 0
      ? childrenAges.split(",").map((age: string) => Number(age))
      : [];

  const fetchHotels = async () => {
    dispatch(openLoadingApi());
    setError(null);

    const body: any = {
      location,
      check_in: checkIn,
      check_out: checkOut,
      num_adults: numAdults,
      num_children: numChildren,
      num_rooms: numRooms,
      children_ages: childrenAgesArray,
      customer_id,
      filters: {},
    };

    if (priceRange && priceRange.length === 2) {
      body.filters.price_range = priceRange;
    }

    if (selectedAmenities && selectedAmenities.length > 0) {
      body.filters.hotel_amenities = selectedAmenities;
    }

    if (selectedDistrict) {
      body.filters.district_name = selectedDistrict;
    }

    if (selectedMinRating !== null && selectedMinRating !== undefined) {
      body.filters.min_rating = selectedMinRating;
    }

    try {
      const queryString = `sortOption=${sortOption}&page=${page}&size=${PAGINATION.PAGE_SIZE}`;
      const url = `${API.SEARCH.SEARCH_HOTEL}?${queryString}`;

      const response = await postRequest(url, body);

      if (response && response.status === STATUS_CODE.OK) {
        setHotelSearchResults(response.data);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
      setError(error.message);
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  React.useEffect(() => {
    fetchHotels();
  }, [
    location,
    checkIn,
    checkOut,
    numAdults,
    numChildren,
    childrenAges,
    numRooms,
    page,
    sortOption,
  ]);

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

  // const handleRoomTypeChange = (newRoomType: string[]) => {
  //   setSelectedRoomType(newRoomType);
  // };

  const handleRatingChange = (newMinRating: number | null) => {
    setSelectedMinRating(newMinRating);
  };

  const handleDistrictChange = (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  React.useEffect(() => {
    scrollToTop();
  }, [page]);

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
        <SearchHotel
          location={location}
          checkIn={dayjs(checkIn)}
          checkOut={dayjs(checkOut)}
          numAdults={numAdults}
          numChildren={numChildren}
          childrenAges={childrenAgesArray}
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
            // height: "calc(100vh - 64px)",
            // overflowY: "auto",
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
          {/* <RoomTypeFilter
            selectedRoomType={selectedRoomType}
            onRoomTypeChange={handleRoomTypeChange}
          /> */}
          <DistrictFilter
            location={location}
            selectedDistrict={selectedDistrict}
            onChangeDistrict={handleDistrictChange}
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
            onClick={() => fetchHotels()}
          >
            Lọc
          </Button>
        </Box>

        {/* Main section for hotel display */}
        {error ? (
          <Card
            sx={{
              backgroundColor: "#ffebee",
              color: "#b71c1c",
              padding: "10px",
              borderRadius: "4px",
              marginTop: "10px",
            }}
          >
            {error}
          </Card>
        ) : (
          <Box
            sx={{
              width: "100%",
              mx: 2,
            }}
          >
            {hotelSearchResults?.items?.length > 0 ? (
              <SearchResult
                location={location}
                checkIn={dayjs(checkIn)}
                checkOut={dayjs(checkOut)}
                numAdults={numAdults}
                numChildren={numChildren}
                childrenAges={childrenAgesArray}
                numRooms={numRooms}
                hotelSearchResults={hotelSearchResults}
                customer_id={customer_id}
                page={page}
                setPage={setPage}
                handleChangePage={handleChangePage}
                sortOption={sortOption}
                setSortOption={setSortOption}
              />
            ) : (
              <Card
                sx={{
                  backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  marginTop: "10px",
                  boxShadow: 1,
                  m: 1,
                  bgcolor: "background.paper",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardContent
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
                  <Typography variant="body1" gutterBottom>
                    Không có khách sạn nào thỏa mãn yêu cầu của quý khách!
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}
