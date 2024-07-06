import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import {
  Typography,
  Box,
  CardMedia,
  Stack,
  useTheme,
  IconButton,
  Card,
  CardContent,
  SvgIcon,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import useMediaQuery from "@mui/material/useMediaQuery";
import formatCurrency from "@/utils/format-currency";
import useCustomAPI from "@/services/common-swr";
import { API, FALLBACK_URL } from "@/constant/constants";
import SkeletonLoading from "./skeleton-loading";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ratingCategory from "@/utils/rating-category";
import FavoriteButton from "../favorite-button";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import { openAlert } from "@/redux/slices/alert-slice";
import { postRequest } from "@/services/api-instance";
import { ALERT_TYPE, STATUS_CODE } from "@/constant/constants";

interface IHotel {
  [key: string]: string | number;
}

interface IOutstandingHotel {
  [key: string]: any;
}

const OutstandingHotel: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));

  const [outstandingHotels, setOutStandingHotels] = useState<
    IOutstandingHotel[]
  >([]);
  const [hotelsPerPage, setHotelsPerPage] = useState(4);

  const customer_id = useAppSelector((state) => state.auth.customer_id);
  const dispatch = useAppDispatch();

  const { data, error, isLoading } = useCustomAPI(
    `${API.HOTEL.GET_OUTSTANDING_HOTELS}?customer_id=${customer_id}`
  );

  useEffect(() => {
    if (data) {
      setOutStandingHotels(data.data);
    }
  }, [data]);

  useEffect(() => {
    const updateHotelsPerPage = () => {
      if (isXs) {
        setHotelsPerPage(1);
      } else if (isSm) {
        setHotelsPerPage(2);
      } else if (isMd) {
        setHotelsPerPage(3);
      } else {
        setHotelsPerPage(4);
      }
    };

    updateHotelsPerPage();
    const handleResize = () => {
      updateHotelsPerPage();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMd, isSm, isXs, theme]);

  if (!outstandingHotels) {
    return <SkeletonLoading hotelsPerPage={hotelsPerPage} />;
  }

  if (error) {
    return (
      <Card
        sx={{
          maxWidth: 600,
          margin: "2rem auto",
          padding: "1rem",
          backgroundColor: "#ffebee",
          color: "#c62828",
          textAlign: "center",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Không tìm được dữ liệu!
          </Typography>
          <Typography variant="body1">
            Đã xảy ra lỗi khi cố gắng tìm nạp dữ liệu. Vui lòng thử lại sau.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <SkeletonLoading hotelsPerPage={hotelsPerPage} />;
  }

  const groupedHotels = [];
  for (let i = 0; i < outstandingHotels.length; i += hotelsPerPage) {
    groupedHotels.push(outstandingHotels.slice(i, i + hotelsPerPage));
  }

  const extractCityFromAddress = (address: string): string => {
    const parts = address.split(",");
    return parts[parts.length - 1].trim();
  };

  const handleNavigate = (hotel_id: number) => {
    const hotel = outstandingHotels.find(
      (hotel: IOutstandingHotel) => hotel?.id === hotel_id
    );
    if (!hotel) {
      console.error(`Hotel with ID ${hotel_id} not found`);
      return;
    }

    const city = extractCityFromAddress(hotel?.hotel_address);

    const searchQueryParams = new URLSearchParams({
      location: city,
      checkIn: dayjs().format("YYYY-MM-DD"),
      checkOut: dayjs().add(1, "day").format("YYYY-MM-DD"),
      numAdults: "1",
      numRooms: "1",
    }).toString();

    router.push(`/hotel/${hotel_id}?${searchQueryParams}`, { scroll: true });
  };

  const addFavoriteHotel = async (hotelId: number) => {
    try {
      const response = await postRequest(`/customer/addFavoriteHotel`, {
        customer_id: customer_id,
        hotel_id: hotelId,
      });

      if (response?.status === STATUS_CODE.OK) {
      } else {
        throw new Error(response.data?.message || "Lỗi không xác định.");
      }
    } catch (error: any) {
      console.error("Error in addFavoriteHotel:", error);
      dispatch(
        openAlert({
          type: ALERT_TYPE.ERROR,
          message:
            error.response?.data?.message || "Đã xảy ra lỗi không mong muốn.",
        })
      );
    }
  };

  const removeFavoriteHotel = async (hotelId: number) => {
    try {
      const response = await postRequest(`/customer/removeFavoriteHotel`, {
        customer_id: customer_id,
        hotel_id: hotelId,
      });

      if (response?.status === STATUS_CODE.OK) {
      } else {
        throw new Error(response.data?.message || "Lỗi không xác định.");
      }
    } catch (error: any) {
      console.error("Error in removeFavoriteHotel:", error);
      dispatch(
        openAlert({
          type: ALERT_TYPE.ERROR,
          message:
            error.response?.data?.message || "Đã xảy ra lỗi không mong muốn.",
        })
      );
    }
  };

  const isHotelLiked = (id: number) =>
    outstandingHotels.some(
      (hotel) => hotel.id === id && hotel.is_favorite_hotel
    );

  const handleToggleLike = (hotelId: number) => {
    console.log(isHotelLiked(hotelId));

    const hotel = outstandingHotels.find((hotel) => hotel.id === hotelId);
    if (!hotel) {
      console.error(`Hotel with ID ${hotelId} not found`);
      return;
    }

    if (hotel.is_favorite_hotel) {
      removeFavoriteHotel(hotelId);
    } else {
      addFavoriteHotel(hotelId);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff5f7",
        minHeight: "300px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          px: 5,
          pt: 3,
          pb: 2,
        }}
      >
        Khách sạn nổi bật
      </Typography>
      <Carousel
        NextIcon={<KeyboardArrowRightIcon />}
        PrevIcon={<KeyboardArrowLeftIcon />}
        navButtonsProps={{
          style: {
            background: "white",
            color: "black",
            zIndex: 2,
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 8px 12px",
            opacity: 1,
          },
        }}
        autoPlay={true}
        fullHeightHover={false}
        stopAutoPlayOnHover={true}
        animation="slide"
        duration={500}
        sx={{
          "& .MuiButtonBase-root": {
            opacity: 1,
            transition: "opacity 0.2s ease",
          },
          "& svg:hover": {
            color: "red",
            transition: "color 0.2s ease",
          },
        }}
      >
        {groupedHotels.map((group, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "stretch",
              padding: "0 24px 24px",
              gap: "16px",
            }}
          >
            {group.map((hotel: IOutstandingHotel, hotelIndex: number) => {
              const hotel_avatar = hotel?.hotelImages?.filter(
                (image: { [key: string]: any }) => {
                  return image.is_primary === true;
                }
              )[0]?.url;
              const hotel_address = `${hotel?.street}, ${hotel?.ward}, ${hotel?.district}, ${hotel?.province}`;

              return (
                <Box
                  key={hotelIndex}
                  sx={{
                    width: `calc(100% / ${hotelsPerPage})`,
                    mx: "16px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.3)",
                      transform: "scale(1.02)",
                      transition:
                        "box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out",
                      cursor: "pointer",
                      bgcolor: "rgb(235,240,252)",
                    },
                    "&:hover .MuiTypography-h6": {
                      color: "primary.main",
                      transition: "all .2s",
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => handleNavigate(hotel?.id)}
                >
                  <Box position="relative">
                    <CardMedia
                      component="img"
                      src={hotel_avatar || FALLBACK_URL.HOTEL_NO_IMAGE}
                      alt={hotel?.name}
                      sx={{
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0",
                      }}
                    />
                    <IconButton
                      sx={{
                        top: "16px",
                        right: "4px",
                        zIndex: 2,
                        position: "absolute",
                        flex: "0 0 auto",
                        color: "rgba(0, 0, 0, 0.54)",
                        padding: "12px",
                        overflow: "visible",
                        fontSize: "1.7142857142857142rem",
                        textAlign: "center",
                        transition:
                          "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        borderRadius: "50%",
                        "& .MuiIconButton-label": {
                          width: "100%",
                          display: "flex",
                          alignItems: "inherit",
                          justifyContent: "inherit",
                        },
                        "&:hover, &:focus": {
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                        },
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleToggleLike(hotel.id);
                      }}
                    >
                      <FavoriteIcon
                        sx={{
                          fill: isHotelLiked(hotel.id) ? "red" : "neutral.900",
                          stroke: "#ffffff",
                          "&:hover": {
                            fill: isHotelLiked(hotel.id)
                              ? "red"
                              : "neutral.900",
                          },
                        }}
                      />
                    </IconButton>
                  </Box>
                  <Box
                    p={2}
                    sx={{
                      flexGrow: 1,
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        fontSize: "18px",
                        fontWeight: "600",
                        lineHeight: "24px",
                        pt: "4px",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: "3",
                        color: "#333",
                      }}
                    >
                      {hotel?.name}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mt: 1 }}
                    >
                      <LocationOnIcon sx={{ color: "#757575" }} />
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          textOverflow: "ellipsis",
                          color: "#555",
                        }}
                      >
                        {hotel_address}
                      </Typography>
                    </Stack>

                    {hotel?.totalReviews !== 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 2,
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
                            {hotel?.averageRatings}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ ml: 1, fontWeight: 600, color: "#333" }}
                          >
                            {ratingCategory(hotel?.averageRatings)}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#757575",
                            ml: "5px",
                          }}
                        >
                          ({hotel?.totalReviews} đánh giá)
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box
                    p={2}
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box></Box>{" "}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        {hotel?.original_room_price !==
                          hotel?.min_room_price && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#718096",
                              textDecoration: "line-through",
                              cursor: "pointer",
                            }}
                            component="span"
                          >
                            {formatCurrency(hotel?.original_room_price)}
                          </Typography>
                        )}
                        <Typography
                          variant="body1"
                          sx={{
                            color: "rgb(229, 62, 62)",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                          component="span"
                        >
                          {formatCurrency(hotel?.min_room_price)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default OutstandingHotel;
