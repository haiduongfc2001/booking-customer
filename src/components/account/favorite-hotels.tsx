"use client";
import { FC } from "react";
import * as React from "react";
import {
  Box,
  CardMedia,
  Grid,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ratingCategory from "@/utils/rating-category";
import Link from "next/link";
import dayjs from "dayjs";
import NoHotels from "./no-hotels";
import { FALLBACK_URL, PAGINATION, STATUS_CODE } from "@/constant/constants";
import { RootState, useAppDispatch, useAppSelector } from "@/redux/store/store";
import { closeLoadingApi, openLoadingApi } from "@/redux/slices/loading-slice";
import { postRequest } from "@/services/api-instance";
import FavoriteButton from "../favorite-button";

interface FavoriteHotelsProps {}

const FavoriteHotels: FC<FavoriteHotelsProps> = () => {
  const [likedHotels, setLikedHotels] = React.useState<
    { [key: string]: any }[]
  >([]);
  const [numLikedHotels, setNumLikedHotels] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(PAGINATION.INITIAL_PAGE);

  const customer_id = useAppSelector(
    (state: RootState) => state.auth.customer_id
  );
  const dispatch = useAppDispatch();
  const initialLoad = React.useRef(true);

  const fetchFavoriteHotels = async () => {
    if (!customer_id) return;

    dispatch(openLoadingApi());

    try {
      const response = await postRequest(
        `/customer/${customer_id}/getFavoriteHotelsByCustomerId`,
        {
          page,
          size: PAGINATION.PAGE_SIZE,
        }
      );

      if (response?.status === STATUS_CODE.OK) {
        setLikedHotels(response.data);
        setNumLikedHotels(response.numFavoriteHotels);
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

  const isHotelLiked = (id: number) =>
    likedHotels.some((hotel) => hotel.id === id);

  const formattedCheckIn = dayjs().add(5, "day").format("YYYY-MM-DD");
  const formattedCheckOut = dayjs().add(6, "day").format("YYYY-MM-DD");

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
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
                  <Grid item xs={12} md={4} sx={{ position: "relative" }}>
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
                    <FavoriteButton
                      hotelId={hotel?.id}
                      isLiked={isHotelLiked(hotel?.id)}
                      onToggle={fetchFavoriteHotels}
                    />
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

      {likedHotels?.length > 0 && (
        <Stack spacing={2} my={2} direction="row" justifyContent="center">
          <Pagination
            showFirstButton
            showLastButton
            defaultPage={Math.min(
              1,
              Math.ceil(numLikedHotels / PAGINATION.PAGE_SIZE)
            )}
            boundaryCount={2}
            count={Math.ceil(numLikedHotels / PAGINATION.PAGE_SIZE) || 1}
            color="primary"
            page={page}
            onChange={handleChangePage}
          />
        </Stack>
      )}
    </Box>
  );
};

export default FavoriteHotels;
