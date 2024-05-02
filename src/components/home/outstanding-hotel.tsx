"use client";
import React, { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import {
  Typography,
  Box,
  CardMedia,
  Stack,
  useTheme,
  IconButton,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import useMediaQuery from "@mui/material/useMediaQuery";
import formatCurrency from "@/utils/format-currency";
import { useAPI } from "@/lib/api";
import { API } from "@/constant/constants";
import SkeletonLoading from "./skeleton-loading";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface IHotel {
  [key: string]: string | number;
}

const OutstandingHotel: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));

  // State to hold the current number of items per page
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    // Determine initial itemsPerPage based on screen size
    if (isXs) {
      return 1;
    } else if (isSm) {
      return 2;
    } else if (isMd) {
      return 3;
    } else {
      return 4; // For lg and up
    }
  });
  const [likedHotels, setLikedHotels] = React.useState<number[]>([]);

  // Update itemsPerPage when screen size changes
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (isXs) {
        setItemsPerPage(1);
      } else if (isSm) {
        setItemsPerPage(2);
      } else if (isMd) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    updateItemsPerPage(); // Call initially to set correct itemsPerPage

    const handleResize = () => {
      updateItemsPerPage();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMd, isSm, isXs, theme]);

  const {
    data: outstandingHotels,
    error,
    isLoading,
  } = useAPI(API.HOTEL.GET_OUTSTANDING_HOTELS);

  React.useEffect(() => {
    // Lọc ra danh sách các hotel đã được yêu thích ban đầu
    if (Array.isArray(outstandingHotels)) {
      const initialLikedHotels = outstandingHotels
        .filter((hotel: IHotel) => hotel.is_favorite_hotel)
        .map((hotel: IHotel) => Number(hotel.hotel_id)); // Chuyển đổi sang kiểu number
      setLikedHotels(initialLikedHotels);
    }
  }, [outstandingHotels]);

  if (error) {
    return <p>Failed to fetch</p>;
  }

  if (isLoading) {
    return <SkeletonLoading itemsPerPage={itemsPerPage} />;
  }

  const groupedItems = [];
  for (let i = 0; i < outstandingHotels.data.length; i += itemsPerPage) {
    groupedItems.push(outstandingHotels.data.slice(i, i + itemsPerPage));
  }

  const extractCityFromAddress = (address: string): string => {
    const parts = address.split(",");
    return parts[parts.length - 1].trim();
  };

  const handleNavigate = (hotel_id: number) => {
    const hotel = outstandingHotels?.data.find(
      (hotel: IOutstandingHotel) => hotel.hotel_id === hotel_id
    );
    if (!hotel) {
      console.error(`Hotel with ID ${hotel_id} not found`);
      return;
    }

    const city = extractCityFromAddress(hotel.hotel_address);

    const searchQueryParams = new URLSearchParams({
      location: city,
      checkInDate: dayjs().format("YYYY-MM-DD"),
      checkOutDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
      numberOfPeople: "1",
      numberOfRooms: "1",
    }).toString();

    router.push(`/hotel/${hotel_id}?${searchQueryParams}`, { scroll: true });
  };

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

  const isHotelLiked = (hotel_id: number) =>
    likedHotels?.includes(hotel_id) || false;

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
        fullHeightHover={false}
        navButtonsProps={{
          style: {
            background: "white",
            color: "black",
            zIndex: 2,
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 8px 12px",
            opacity: 1,
          },
        }}
        autoPlay={false}
        stopAutoPlayOnHover={true}
        animation="slide"
        duration={500}
        // indicators={false}
        sx={{
          "& .MuiButtonBase-root": {
            opacity: 1,
            transition: "opacity 0.2s ease",
          },
          "& svg:hover": {
            color: "#00B6F3",
            transition: "color 0.2s ease",
          },
        }}
      >
        {groupedItems.map((group, index) => (
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
            {group.map((item: IOutstandingHotel, itemIndex: number) => (
              <Box
                key={itemIndex}
                sx={{
                  width: `calc(100% / ${itemsPerPage})`,
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
                onClick={() => handleNavigate(item.hotel_id)}
              >
                <Box position="relative">
                  <CardMedia
                    component="img"
                    src={
                      item?.hotel_avatar ||
                      "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                    }
                    alt={item.hotel_name}
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
                      "& svg:hover": {
                        color: "neutral.800",
                        transition: "color 0.2s ease",
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.hotel_id);
                    }}
                  >
                    <FavoriteIcon
                      sx={{
                        fill: isHotelLiked(item.hotel_id)
                          ? "red"
                          : "neutral.900",
                        stroke: "#ffffff",
                      }}
                    />
                  </IconButton>
                </Box>
                <Box p={2} sx={{ flexGrow: 1 }}>
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
                    {item.hotel_name}
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
                      {item.hotel_address}
                    </Typography>
                  </Stack>
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
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#718096",
                          textDecoration: "line-through",
                          cursor: "pointer",
                        }}
                        component="span"
                      >
                        {formatCurrency(item.original_room_price)}
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
                        {formatCurrency(item.min_room_price)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default OutstandingHotel;
