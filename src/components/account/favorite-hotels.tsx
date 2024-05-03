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
import { favoriteHotels } from "@/utils/data";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ratingCategory from "@/utils/rating-category";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import dayjs from "dayjs";
import NoHotels from "./no-hotels";

interface FavoriteHotelsProps {}

const FavoriteHotels: FC<FavoriteHotelsProps> = () => {
  const [likedHotels, setLikedHotels] = React.useState<number[]>([]);

  React.useEffect(() => {
    // Lọc ra danh sách các hotel đã được yêu thích ban đầu
    const initialLikedHotels = favoriteHotels
      .filter((hotel) => hotel?.is_favorite_hotel)
      .map((hotel) => hotel?.hotel_id);
    setLikedHotels(initialLikedHotels);
  }, []);

  const toggleLike = (hotel_id: number) => {
    if (likedHotels.includes(hotel_id)) {
      // Unlike hotel
      console.log("Remove hotel favorite: ", hotel_id);
      setLikedHotels((prevLikedHotels) =>
        prevLikedHotels.filter((id) => id !== hotel_id)
      );
    } else {
      // Like hotel
      console.log("Add hotel favorite: ", hotel_id);
      setLikedHotels((prevLikedHotels) => [...prevLikedHotels, hotel_id]);
    }
  };

  const isHotelLiked = (hotel_id: number) => likedHotels.includes(hotel_id);

  const formattedCheckInDate = dayjs().format("YYYY-MM-DD");
  const formattedCheckOutDate = dayjs().add(1).format("YYYY-MM-DD");

  const getCityFromAddress = (address: string): string => {
    const addressArray = address?.split(",");
    // Tách thành phố/tỉnh từ địa chỉ
    const city = addressArray[addressArray?.length - 1]?.trim();

    return city || "Hà Nội"; // Nếu không tìm thấy tỉnh/thành phố thì trả về "Hà Nội" mặc định
  };

  return (
    <Box sx={{ flex: "1" }}>
      {favoriteHotels.length > 0 ? (
        <Grid container spacing={3}>
          {favoriteHotels?.map((hotel) => (
            <Grid item xs={12} key={hotel?.hotel_id}>
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
                      src={
                        hotel?.hotel_avatar ||
                        "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                      }
                      alt={hotel?.hotel_name}
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
                      onClick={() => toggleLike(hotel?.hotel_id)}
                    >
                      <FavoriteIcon
                        sx={{
                          fill: isHotelLiked(hotel?.hotel_id)
                            ? "red"
                            : "neutral.900",
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
                            location: getCityFromAddress(hotel?.hotel_address),
                            checkInDate: formattedCheckInDate,
                            checkOutDate: formattedCheckOutDate,
                            numberOfPeople: "1",
                            numberOfRooms: "1",
                          }).toString();

                          return (
                            <Link
                              href={`/hotel/${hotel?.hotel_id}?${searchQueryParams}`}
                            >
                              {hotel?.hotel_name}
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
                          &nbsp;{hotel?.hotel_rating}
                        </IconButton>
                        {ratingCategory(hotel?.hotel_rating)}
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
                          {getCityFromAddress(hotel?.hotel_address)}
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
