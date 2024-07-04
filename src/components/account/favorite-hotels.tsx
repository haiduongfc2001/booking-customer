"use client";
import { FC } from "react";
import * as React from "react";
import {
  Box,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ratingCategory from "@/utils/rating-category";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import dayjs from "dayjs";
import NoHotels from "./no-hotels";
import { ALERT_TYPE, FALLBACK_URL, STATUS_CODE } from "@/constant/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import { closeLoadingApi, openLoadingApi } from "@/redux/slices/loading-slice";
import { getRequest, postRequest } from "@/services/api-instance";
import { RootState } from "@/redux/store/store";
import { openAlert } from "@/redux/slices/alert-slice";

interface FavoriteHotelsProps {}

const FavoriteHotels: FC<FavoriteHotelsProps> = () => {
  const [likedHotels, setLikedHotels] = React.useState<
    { [key: string]: any }[]
  >([]);

  // const customer_id = useAppSelector((state: RootState) => state.auth.customer_id);
  const customer_id = 525;
  const dispatch = useAppDispatch();
  const initialLoad = React.useRef(true);

  const fetchFavoriteHotels = async () => {
    if (!customer_id) return;

    dispatch(openLoadingApi());

    try {
      const response = await getRequest(
        `/customer/${customer_id}/getFavoriteHotelsByCustomerId`
      );

      if (response?.status === STATUS_CODE.OK) {
        setLikedHotels(response.data);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    } finally {
      dispatch(closeLoadingApi());
    }
  };

  React.useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    fetchFavoriteHotels();
  }, [customer_id]);

  const addFavoriteHotel = async (hotelId: number) => {
    try {
      const response = await postRequest(`/customer/addFavoriteHotel`, {
        customer_id,
        hotel_id: hotelId,
      });
      if (response?.status === STATUS_CODE.CREATED) {
        fetchFavoriteHotels();
      }
    } catch (error: any) {
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
        customer_id,
        hotel_id: hotelId,
      });
      if (response?.status === STATUS_CODE.OK) {
        fetchFavoriteHotels();
      }
    } catch (error: any) {
      dispatch(
        openAlert({
          type: ALERT_TYPE.ERROR,
          message:
            error.response?.data?.message || "Đã xảy ra lỗi không mong muốn.",
        })
      );
    }
  };

  const toggleLike = (hotelId: number) => {
    if (isHotelLiked(hotelId)) {
      removeFavoriteHotel(hotelId);
    } else {
      addFavoriteHotel(hotelId);
    }
  };

  const isHotelLiked = (id: number) =>
    likedHotels.some((hotel) => hotel.id === id);

  const formattedCheckIn = dayjs().add(5, "day").format("YYYY-MM-DD");
  const formattedCheckOut = dayjs().add(6, "day").format("YYYY-MM-DD");

  return (
    <Box sx={{ flex: "1" }}>
      {likedHotels.length > 0 ? (
        <Grid container spacing={3}>
          {likedHotels?.map((hotel) => (
            <Grid item xs={12} key={hotel?.id}>
              <Box
                sx={{
                  color: "neutral.900",
                  width: "100%",
                  border: "2px solid #EDF2F7",
                  display: "flex",
                  p: 2,
                  fontSize: "14px",
                  bgcolor: "neutral.100",
                  boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.05)",
                  transition: "all 0.2s",
                  fontWeight: "normal",
                  lineHeight: "17px",
                  borderRadius: 1,
                  "&:hover": {
                    bgcolor: "primary.light",
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                  },
                  "&:hover .MuiTypography-h6": {
                    color: "primary.main",
                    transition: "all .2s",
                    cursor: "pointer",
                  },
                }}
              >
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      position: "relative",
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={hotel?.avatar || FALLBACK_URL.HOTEL_NO_IMAGE}
                      alt={hotel?.name}
                      sx={{
                        width: "100%",
                        height: "214px",
                        objectFit: "cover",
                        borderRadius: 1,
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
                      }}
                      onClick={() => toggleLike(hotel?.id)}
                    >
                      <FavoriteIcon
                        sx={{
                          fill: isHotelLiked(hotel?.id) ? "red" : "neutral.900",
                          stroke: "#ffffff",
                        }}
                      />
                    </IconButton>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box>
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
                        }}
                      >
                        {(() => {
                          const searchQueryParams = new URLSearchParams({
                            location: hotel?.city,
                            checkIn: formattedCheckIn,
                            checkOut: formattedCheckOut,
                            numAdults: "1",
                            numRooms: "1",
                          }).toString();

                          return (
                            <Link
                              href={`/hotel/${hotel?.id}?${searchQueryParams}`}
                            >
                              {hotel?.name}
                            </Link>
                          );
                        })()}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          my: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            color: "primary.main",
                            display: "flex",
                            p: "1px 2px 0 0",
                            fontWeight: "600",
                            mr: "5px",
                            borderRadius: "4px",
                            bgcolor: "primary.light",
                            fontSize: "16px",
                          }}
                        >
                          <RateReviewIcon />
                          &nbsp;{hotel?.rating}
                        </IconButton>
                        {ratingCategory(hotel?.rating)}
                        <Box
                          component="span"
                          sx={{
                            color: "#4A5568",
                            ml: "5px",
                          }}
                        >
                          (100 đánh giá)
                        </Box>
                      </Box>
                      <Stack direction="row">
                        <LocationOnIcon />
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {hotel?.address}
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoHotels />
      )}
    </Box>
  );
};

export default FavoriteHotels;
