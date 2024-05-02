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
import formatCurrency from "@/utils/format-currency";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import { searchResult } from "@/utils/data";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface SearchResultProps {
  location: string;
  checkInDate: Dayjs;
  checkOutDate: Dayjs;
  numberOfPeople: number;
  numberOfRooms: number;
}

interface IHotel {
  [key: string]: string | number;
}

const SearchResult: FC<SearchResultProps> = ({
  location = "",
  checkInDate = dayjs(),
  checkOutDate = dayjs().add(1, "day"),
  numberOfPeople = 1,
  numberOfRooms = 1,
}) => {
  const router = useRouter();
  const [likedHotels, setLikedHotels] = React.useState<number[]>([]);

  const handleNavigate = (hotel_id: number) => {
    const formattedCheckInDate = checkInDate.format("YYYY-MM-DD");
    const formattedCheckOutDate = checkOutDate.format("YYYY-MM-DD");

    const searchQueryParams = new URLSearchParams({
      location,
      checkInDate: formattedCheckInDate,
      checkOutDate: formattedCheckOutDate,
      numberOfPeople: String(numberOfPeople),
      numberOfRooms: String(numberOfRooms),
    }).toString();

    router.push(`/hotel/${hotel_id}?${searchQueryParams}`, { scroll: true });
  };

  React.useEffect(() => {
    // Lọc ra danh sách các hotel đã được yêu thích ban đầu
    const initialLikedHotels = searchResult
      .filter((hotel: IHotel) => hotel.is_favorite_hotel)
      .map((hotel) => hotel.hotel_id);
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

  return (
    <Box sx={{ flex: "1", p: "0 20px" }}>
      <Box
        width="100%"
        height="100px"
        m={2}
        p={2}
        bgcolor="background.paper"
        borderRadius="8px"
        display="flex"
        justifyContent="center"
        flexDirection="column"
      >
        <Typography variant="h5">{location}</Typography>
        <Typography component="span">
          {`Có ${searchResult?.length ?? 0} khách sạn ở ${location}`}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Display hotels as cards */}
        {searchResult?.map((hotel) => (
          <Grid item xs={12} key={hotel.hotel_id}>
            <Box
              sx={{
                width: "100%",
                mx: 2,
                p: 2,
                borderRadius: 1,
                overflow: "hidden",
                boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
                bgcolor: "background.paper",
                display: "flex",
                "&:hover": {
                  bgcolor: "rgb(235,240,252)",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                },
                "&:hover .MuiTypography-h6": {
                  color: "primary.main",
                  transition: "all .2s",
                  cursor: "pointer",
                },
              }}
              onClick={() => handleNavigate(hotel.hotel_id)}
            >
              <Grid container spacing={2}>
                <Grid
                  item
                  sm={12}
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
                    alt={hotel.hotel_name}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(hotel.hotel_id);
                    }}
                  >
                    <FavoriteIcon
                      sx={{
                        fill: isHotelLiked(hotel.hotel_id)
                          ? "red"
                          : "neutral.900",
                        stroke: "#ffffff",
                      }}
                    />
                  </IconButton>
                </Grid>
                <Grid item sm={12} md={5}>
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
                      {hotel.hotel_name}
                    </Typography>
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
                        {hotel.hotel_address}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item sm={12} md={3}>
                  <Box
                    p={2}
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#718096",
                        textDecoration: "line-through",
                        cursor: "pointer",
                      }}
                      component="span"
                    >
                      {formatCurrency(hotel.original_room_price)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "rgb(229, 62, 62)",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      component="span"
                    >
                      {formatCurrency(hotel.min_room_price)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchResult;
