"use client";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HotelIcon from "@mui/icons-material/Hotel";
import RateReviewIcon from "@mui/icons-material/RateReview";
import formatCurrency from "@/utils/format-currency";
import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Image from "next/image";
import { Line, Circle } from "rc-progress";
import ratingCategory from "@/utils/rating-category";
import { amenitiesData, hotelDataFake, ratingData } from "@/utils/data";
import RoomList from "@/components/hotel-detail/room-list";
import HotelsAround from "@/components/hotel-detail/hotels-around";
import HotelReviews from "@/components/hotel-detail/hotel-reviews";
import calculateNumberOfNights from "@/utils/calculate-number-of-nights";
import { API, STATUS_CODE } from "@/constant/constants";
import { postRequest } from "@/services/api-instance";
import {
  calculateAndConvertToPercentage,
  calculateAverageRating,
  roundAverageRating,
} from "@/utils/rating-utils";

export default function HotelDetail(props: any) {
  const { location, checkInDate, checkOutDate, numAdults, numRooms, filters } =
    props.searchParams;
  const { hotel_id } = props.params;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hotelData, setHotelData] = React.useState<any>();
  const [hotelsAround, setHotelsAround] = React.useState<any[]>([]);

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.only("md"));

  const searchQueryParams = new URLSearchParams({
    location,
    checkInDate,
    checkOutDate,
    numAdults,
    numRooms,
  }).toString();

  // Trích xuất giá trị rating từ mảng ratingData
  const ratings: string[] = ratingData.map((item) => item.rating);

  const numericRating = roundAverageRating(calculateAverageRating(ratings));

  // Sử dụng giá trị ratings để tính toán phần trăm
  const percentRating = calculateAndConvertToPercentage(ratings);

  const numberOfNights = calculateNumberOfNights(checkInDate, checkOutDate);

  React.useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      setError(null);

      const detailBody = {
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_adults: numAdults,
        num_children: 0,
        num_rooms: numRooms,
        children_ages: [],
        hotel_id,
        filters: {
          price_range: filters?.priceRange,
          amenities: filters?.selectedAmenities,
          room_type: filters?.selectedRoomType,
          min_rating: filters?.selectedMinRating,
        },
      };

      const searchBody = {
        location,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_adults: numAdults,
        num_children: 0,
        num_rooms: numRooms,
      };

      try {
        const detailResponse = await postRequest(
          `/hotel/${hotel_id}/getHotelDetail`,
          detailBody
        );
        const searchResponse = await postRequest(
          API.SEARCH.SEARCH_HOTEL,
          searchBody
        );

        console.log(detailResponse);
        console.log(searchResponse);

        if (detailResponse && detailResponse.status === STATUS_CODE.OK) {
          setHotelData(detailResponse.data);
        }

        if (searchResponse && searchResponse.status === STATUS_CODE.OK) {
          setHotelsAround(
            searchResponse.data?.items.filter(
              (hotel: { [key: string]: any }) => hotel.id !== Number(hotel_id)
            ) || []
          );
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
    checkInDate,
    checkOutDate,
    numAdults,
    numRooms,
    filters,
    hotel_id,
  ]);

  return (
    <div>
      <Box mx={10} my={4}>
        <CustomizedBreadcrumbs
          newBreadcrumbsData={[
            {
              label: `${location}`,
              href: `/search?${searchQueryParams}`,
              icon: <LocationOnIcon />,
            },
            {
              label: `${hotelData?.name}`,
              icon: <HotelIcon />,
            },
          ]}
        />

        <Box
          sx={{
            color: "#1a202c",
            fontSize: "14px",
            fontWeight: "normal",
            lineHeight: "17px",
            mt: 3,
          }}
        >
          <Box
            sx={{
              borderBottom: "none",
              pb: "0 !important",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              my: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  margin: "0 0 6px 0",
                  fontSize: "24px",
                  fontWeight: "600",
                  lineHeight: "29px",
                }}
              >
                {hotelData?.name}
              </Typography>

              {hotelData?.reviews && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      color: "#FF3366",
                      display: "flex",
                      p: "1px 2px 0 0",
                      fontWeight: "600",
                      mr: "5px",
                      borderRadius: "4px",
                      bgcolor: "rgba(255, 51, 102, 0.1)",
                    }}
                  >
                    <RateReviewIcon />
                    {hotelData?.reviews.average_rate}
                  </IconButton>
                  {ratingCategory(numericRating)}
                  <Box
                    component="span"
                    sx={{
                      color: "#4A5568",
                      ml: "5px",
                    }}
                  >
                    ({hotelData?.reviews.total_reviews} đánh giá)
                  </Box>
                  <Button
                    color="primary"
                    aria-label="Xem dánh giá"
                    sx={{
                      p: "5px",
                      minHeight: "auto",
                    }}
                  >
                    Xem đánh giá
                  </Button>
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <IconButton
                  sx={{
                    mr: "5px",
                  }}
                  size="small"
                >
                  <LocationOnIcon />
                </IconButton>
                <Box component="span">{hotelData?.address}</Box>
                <Button
                  color="primary"
                  aria-label="Xem bản đồ"
                  sx={{
                    p: "5px",
                    minHeight: "auto",
                  }}
                >
                  Xem bản đồ
                </Button>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "12px",
                    lineHeight: "18px",
                    fontWeight: 400,
                    color: "rgb(115, 115, 115)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: 1,
                  }}
                >
                  từ
                </Typography>
                <Box
                  component="span"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "600",
                    lineHeight: "24px",
                  }}
                >
                  {formatCurrency(hotelData?.min_room_price)}
                </Box>
              </Box>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  ml: 2,
                }}
              >
                Chọn phòng
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              overflowY: "auto",
              maxHeight: 328,
            }}
          >
            <ImageList variant="quilted" cols={4} gap={8} rowHeight={160}>
              {hotelData?.images.map(
                (image: { [key: string]: any }, index: number) => (
                  <ImageListItem
                    key={image.id}
                    cols={index === 0 ? 2 : 1}
                    rows={index === 0 ? 2 : 1}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                      }}
                    >
                      <Image
                        fill
                        priority
                        // loading="lazy"
                        // loader={() => image.url}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        src={image.url}
                        alt={image.caption}
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                      />
                    </div>
                    <ImageListItemBar
                      sx={{
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                          "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                      }}
                      title={image.caption}
                      position="bottom"
                      actionIcon={
                        <IconButton
                          sx={{ color: "white" }}
                          aria-label={`star ${image.caption}`}
                        >
                          <StarBorderIcon />
                        </IconButton>
                      }
                      actionPosition="left"
                    />
                  </ImageListItem>
                )
              )}
            </ImageList>
          </Box>

          <Box my={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={7}>
                <Box
                  sx={{
                    borderRadius: 1,
                    borderColor: "rgb(221, 223, 226)",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    p: 2,
                    boxShadow: "none",
                    m: 0,
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography variant="h6" mb={1}>
                    Mô tả khách sạn
                  </Typography>
                  <Typography variant="body2">
                    {hotelData?.description}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    borderRadius: 1,
                    borderColor: "rgb(221, 223, 226)",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    p: 2,
                    boxShadow: "none",
                    mt: 3,
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography variant="h6" mb={1}>
                    Đánh giá
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Box
                      sx={{
                        width: 160,
                        height: 160,
                        position: "relative",
                      }}
                    >
                      <Circle
                        percent={percentRating}
                        strokeWidth={4}
                        strokeColor="#6366F1"
                        trailWidth={4}
                        trailColor="#e2e8f0"
                        style={{
                          width: 160,
                          height: 160,
                        }}
                      />
                      <Box
                        sx={{
                          top: "50%",
                          left: "50%",
                          display: "flex",
                          position: "absolute",
                          transform: "translate(-50%, -50%)",
                          textAlign: "center",
                          alignItems: "center",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: "primary.main",
                            fontSize: "30px",
                            fontWeight: "600",
                            lineHeight: "42px",
                          }}
                        >
                          {numericRating}
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            fontWeight: "400",
                          }}
                        >
                          {ratingCategory(numericRating)}
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        mr: 8,
                      }}
                    >
                      {ratingData.map((rating) => (
                        <Box
                          key={rating.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: "10px",
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: "70px",
                              mr: "10px",
                            }}
                          >
                            {rating.criteria}
                          </Box>
                          <Box width={200}>
                            <Line
                              percent={parseFloat(rating.rating) * 10}
                              strokeWidth={4}
                              strokeColor="#6366F1"
                              trailWidth={4}
                              trailColor="#e2e8f0"
                              style={{
                                width: 200,
                              }}
                            />
                          </Box>
                          <Box
                            component="span"
                            sx={{
                              textAlign: "right",
                              ml: "10px",
                            }}
                          >
                            {rating.rating}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    borderRadius: 1,
                    borderColor: "rgb(221, 223, 226)",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    p: 2,
                    boxShadow: "none",
                    m: 0,
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography variant="h6">Tiện nghi khách sạn</Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: "192px",
                      display: "flex",
                      flexWrap: "wrap",
                      mt: "12px",
                    }}
                  >
                    {amenitiesData?.map((amenity) => (
                      <Box
                        key={amenity.id}
                        sx={{
                          width: isMd ? "50%" : "33.33%",
                          display: "flex",
                          p: "12px 7px",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CheckCircleOutlineIcon
                          sx={{ color: "primary.main" }}
                        />
                        <Box
                          component="span"
                          sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            minWidth: "85px",
                            textAlign: "center",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            ml: 0.5,
                          }}
                        >
                          {amenity.name}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <RoomList numberOfNights={numberOfNights} numRooms={numRooms} />

          <HotelsAround hotelsAround={hotelsAround} />

          <Box
            sx={{
              width: "100%",
              height: "4px",
              margin: "24px 0",
              background: "#6366F1",
              borderRadius: 1,
            }}
          />
        </Box>

        {hotelData?.reviews?.length > 0 && (
          <HotelReviews
            hotelData={hotelData}
            numericRating={numericRating}
            percentRating={percentRating}
            countByRatingLevel={hotelDataFake?.countByRatingLevel}
          />
        )}

        {/* <List>
        <ListItem>location : {location}</ListItem>
        <ListItem>checkInDate : {checkInDate}</ListItem>
        <ListItem>checkOutDate : {checkOutDate}</ListItem>
        <ListItem>numAdults : {numAdults}</ListItem>
        <ListItem>numRooms : {numRooms}</ListItem>
      </List> */}
      </Box>
    </div>
  );
}
