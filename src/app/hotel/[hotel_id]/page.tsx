"use client";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import {
  Box,
  Button,
  Card,
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
import RoomTypeList from "@/components/hotel-detail/room-type-list";
import HotelsAround from "@/components/hotel-detail/hotels-around";
import HotelReviews from "@/components/hotel-detail/hotel-reviews";
import calculateNumberOfNights from "@/utils/calculate-number-of-nights";
import { API, STATUS_CODE } from "@/constant/constants";
import { postRequest } from "@/services/api-instance";
import { AppDispatch, useAppDispatch } from "@/redux/store/store";
import { closeLoadingApi, openLoadingApi } from "@/redux/slices/loading-slice";
import SkeletonComponent from "@/components/layout/loading-skeleton";
import HotelPolicies from "@/components/hotel-detail/policies-list";

export default function HotelDetail(props: any) {
  const { location, checkIn, checkOut, numAdults, numRooms, filters } =
    props.searchParams;
  const { hotel_id } = props.params;
  const [error, setError] = React.useState<string | null>(null);
  const [hotelData, setHotelData] = React.useState<any>();
  const [hotelsAround, setHotelsAround] = React.useState<any[]>([]);
  const [roomTypes, setRoomTypes] = React.useState<any[]>([]);

  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const dispatch: AppDispatch = useAppDispatch();

  const searchQueryParams = new URLSearchParams({
    location,
    checkIn,
    checkOut,
    numAdults,
    numRooms,
  }).toString();

  const numNights = calculateNumberOfNights(checkIn, checkOut);

  React.useEffect(() => {
    const fetchHotelDetail = async () => {
      setError(null);

      const detailBody = {
        check_in: checkIn,
        check_out: checkOut,
        num_adults: Number(numAdults),
        num_children: Number(0),
        num_rooms: Number(numRooms),
        children_ages: [],
        hotel_id,
        filters: {
          price_range: filters?.priceRange,
          amenities: filters?.selectedAmenities,
          room_type: filters?.selectedRoomType,
          min_rating: filters?.selectedMinRating,
        },
      };

      try {
        const detailResponse = await postRequest(
          `/hotel/${hotel_id}/getHotelDetail`,
          detailBody
        );

        if (detailResponse && detailResponse.status === STATUS_CODE.OK) {
          setHotelData(detailResponse.data);
          setRoomTypes(detailResponse.data.roomTypes);
        } else {
          setError(
            detailResponse?.data?.message || "Failed to fetch hotel detail"
          );
        }
      } catch (error: any) {
        console.error(error.response?.data?.message || error.message);
        setError(error.message);
      }
    };

    const fetchHotelsAround = async () => {
      setError(null);

      const searchBody = {
        location,
        check_in: checkIn,
        check_out: checkOut,
        num_adults: Number(numAdults),
        num_children: Number(0),
        num_rooms: Number(numRooms),
      };

      try {
        const searchResponse = await postRequest(
          API.SEARCH.SEARCH_HOTEL,
          searchBody
        );

        if (searchResponse && searchResponse.status === STATUS_CODE.OK) {
          setHotelsAround(
            searchResponse.data?.items.filter(
              (hotel: { [key: string]: any }) => hotel.id !== Number(hotel_id)
            ) || []
          );
        } else {
          setError(
            searchResponse?.data?.message || "Failed to fetch hotels around"
          );
        }
      } catch (error: any) {
        console.error(error.response?.data?.message || error.message);
        setError(error.message);
      }
    };

    fetchHotelDetail();
    fetchHotelsAround();
  }, [location, checkIn, checkOut, numAdults, numRooms, filters, hotel_id]);

  const roomRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
  const reviewRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToRoom = (minRoomPrice: number, originalRoomPrice: number) => {
    if (hotelData && hotelData?.roomTypes) {
      const roomType = hotelData?.roomTypes.find(
        (room_type: any) =>
          room_type.effective_price === minRoomPrice &&
          room_type.base_price === originalRoomPrice
      );

      if (roomType && roomRefs.current[roomType.id]) {
        roomRefs.current[roomType.id]?.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  };

  const scrollToReview = () => {
    reviewRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const customerRequest = {
    checkIn,
    checkOut,
    numAdults,
    numRooms,
    numChildren: 0,
    childrenAges: [],
    hotelId: Number(hotel_id),
  };

  const ratingData = (averageRatings: { [key: string]: any }) => {
    return [
      {
        id: 1,
        criteria: "Vị trí",
        rating: averageRatings?.location || 0,
      },
      {
        id: 2,
        criteria: "Giá cả",
        rating: averageRatings?.price || 0,
      },
      {
        id: 3,
        criteria: "Phục vụ",
        rating: averageRatings?.service || 0,
      },
      {
        id: 4,
        criteria: "Vệ sinh",
        rating: averageRatings?.cleanliness || 0,
      },
      {
        id: 5,
        criteria: "Tiện nghi",
        rating: averageRatings?.amenities || 0,
      },
    ];
  };

  // Sử dụng giá trị ratings để tính toán phần trăm
  const percentRating = (hotelData?.averageRatings?.overall / 10) * 100;

  return (
    <div>
      {hotelData ? (
        hotelData?.roomTypes?.length <= 0 ? (
          <Card sx={{ width: "100%", m: 2 }}>
            <Typography>Khách sạn hiện không có phòng khả dụng!</Typography>
          </Card>
        ) : (
          <Box mx={10} my={4}>
            <CustomizedBreadcrumbs
              newBreadcrumbsData={[
                {
                  label: `${hotelData?.province}`,
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

                  {hotelData?.totalReviews !== 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 1,
                        p: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color: "#ffffff",
                            display: "flex",
                            padding: "4px 8px",
                            fontSize: "14px",
                            bgcolor: "primary.main",
                            alignItems: "center",
                            fontWeight: 600,
                            borderRadius: "4px",
                            justifyContent: "center",
                          }}
                        >
                          {hotelData?.averageRatings?.overall}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          {ratingCategory(hotelData?.averageRatings?.overall)}
                        </Typography>
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          color: "#4A5568",
                          ml: "5px",
                        }}
                      >
                        ({hotelData?.totalReviews} đánh giá)
                      </Box>
                      <Button
                        color="primary"
                        aria-label="Xem dánh giá"
                        sx={{
                          p: "5px",
                          minHeight: "auto",
                        }}
                        onClick={scrollToReview}
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
                    {/* <Button
                    color="primary"
                    aria-label="Xem bản đồ"
                    sx={{
                      p: "5px",
                      minHeight: "auto",
                    }}
                  >
                    Xem bản đồ
                  </Button> */}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "flex-end",
                    }}
                  >
                    {hotelData?.original_room_price !==
                      hotelData?.min_room_price && (
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "16px",
                          fontWeight: 500,
                          textDecoration: "line-through",
                        }}
                      >
                        {formatCurrency(hotelData?.original_room_price)}
                      </Typography>
                    )}
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
                        chỉ từ
                      </Typography>
                      <Box
                        component="span"
                        sx={{
                          fontSize: "20px",
                          fontWeight: "600",
                          lineHeight: "24px",
                          color: "rgb(229, 62, 62)",
                        }}
                      >
                        {formatCurrency(hotelData?.min_room_price)}
                      </Box>
                    </Box>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      ml: 2,
                    }}
                    onClick={() =>
                      scrollToRoom(
                        hotelData?.min_room_price,
                        hotelData?.original_room_price
                      )
                    }
                  >
                    Chọn phòng
                  </Button>
                </Box>
              </Box>

              {hotelData?.hotelImages?.length > 0 && (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    overflowY: "auto",
                    maxHeight: 328,
                  }}
                >
                  <ImageList variant="quilted" cols={4} gap={8} rowHeight={160}>
                    {hotelData?.hotelImages?.map(
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
                              style={{
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
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
              )}

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
                      <Typography
                        variant="body2"
                        dangerouslySetInnerHTML={{
                          __html: hotelData?.description,
                        }}
                      />
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
                      {hotelData?.totalReviews === 0 ? (
                        <Box
                          sx={{
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            bgcolor: "background.paper",
                            mb: 3,
                            p: 3,
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            priority
                            src="https://img.freepik.com/free-vector/flat-hotel-booking-concept-background_23-2148147581.jpg"
                            alt="no-reviews"
                            width="249"
                            height="210"
                            // loading="lazy"
                          />
                          <Typography>Chưa có đánh giá nào!</Typography>
                        </Box>
                      ) : (
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mt={2}
                        >
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
                                {hotelData?.averageRatings?.overall}
                              </Box>
                              <Box
                                component="span"
                                sx={{
                                  fontWeight: "400",
                                }}
                              >
                                {ratingCategory(
                                  hotelData?.averageRatings?.overall
                                )}
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
                            {ratingData(hotelData?.averageRatings).map(
                              (rating) => (
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
                              )
                            )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        borderRadius: 1,
                        borderColor: "rgb(221, 223, 226)",
                        borderStyle: "solid",
                        borderWidth: "1px",
                        m: 0,
                        p: 2,
                        boxShadow: "none",
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
                        {hotelData?.hotelAmenities?.map(
                          (amenity: { [key: string]: any }) => (
                            <Box
                              key={amenity?.id}
                              sx={{
                                width: isMd ? "50%" : "33.33%",
                                display: "flex",
                                p: "12px 7px",
                                justifyContent: "flex-start",
                                alignItems: "center",
                                gap: 1,
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
                                {amenity?.amenity}
                              </Box>
                            </Box>
                          )
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <HotelPolicies policies={hotelData.policies} />

              {hotelData?.roomTypes?.length > 0 ? (
                <RoomTypeList
                  hotelData={hotelData}
                  roomTypes={roomTypes}
                  setRoomTypes={setRoomTypes}
                  numNights={numNights}
                  roomRefs={roomRefs}
                  customerRequest={customerRequest}
                />
              ) : (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      width: "100%",
                      p: 2,
                      borderRadius: 1,
                      overflow: "hidden",
                      boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
                      bgcolor: "background.paper",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h5" color="primary">
                      Rất tiếc, bạn vừa bỏ lỡ rồi
                    </Typography>
                  </Box>
                </Grid>
              )}

              {hotelsAround?.length > 0 && (
                <HotelsAround hotelsAround={hotelsAround} />
              )}

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

            {hotelData?.id && hotelData?.averageRatings?.overall !== 0 && (
              <HotelReviews hotelId={hotelData.id} reviewRef={reviewRef} />
            )}
          </Box>
        )
      ) : (
        <Box mx={10} my={4}>
          <SkeletonComponent />
        </Box>
      )}
    </div>
  );
}
