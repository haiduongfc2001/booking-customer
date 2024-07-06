"use client";
import React, { FC, useEffect, useState } from "react";
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
import SkeletonLoading from "./skeleton-loading";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FALLBACK_URL } from "@/constant/constants";

interface IHotel {
  [key: string]: string | number;
}

interface IHotelAround {
  hotel_id: number;
  name: string;
  province: string;
  address: string;
  images: { [key: string]: any };
  min_room_price: number;
  original_room_price: number;
}

interface IHotelsAround {
  hotelsAround: IHotelAround[];
}

const HotelsAround: FC<IHotelsAround> = ({ hotelsAround }) => {
  const router = useRouter();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));

  const [hotelsPerPage, setItemsPerPage] = useState(() => {
    if (isXs) {
      return 1;
    } else if (isSm) {
      return 2;
    } else if (isMd) {
      return 3;
    } else {
      return 4;
    }
  });

  const [likedHotels, setLikedHotels] = useState<number[]>([]);

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

    updateItemsPerPage();

    const handleResize = () => {
      updateItemsPerPage();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMd, isSm, isXs, theme]);

  useEffect(() => {
    if (Array.isArray(hotelsAround)) {
      const initialLikedHotels = hotelsAround
        .map((hotel: IHotelAround) => hotel.hotel_id)
        .filter((hotelId: number) => likedHotels.includes(hotelId));
      setLikedHotels(initialLikedHotels);
    }
  }, [hotelsAround]);

  if (!hotelsAround) {
    return <SkeletonLoading hotelsPerPage={hotelsPerPage} />;
  }

  const groupedItems = [];
  for (let i = 0; i < hotelsAround.length; i += hotelsPerPage) {
    groupedItems.push(hotelsAround.slice(i, i + hotelsPerPage));
  }

  const handleNavigate = (hotel_id: number) => {
    const hotel = hotelsAround?.find(
      (hotel: IHotelAround) => hotel.hotel_id === hotel_id
    );
    if (!hotel) {
      console.error(`Hotel with ID ${hotel_id} not found`);
      return;
    }

    const searchQueryParams = new URLSearchParams({
      location: hotel.province,
      checkIn: dayjs().add(5, "day").format("YYYY-MM-DD"),
      checkOut: dayjs().add(6, "day").format("YYYY-MM-DD"),
      numAdults: "1",
      numRooms: "1",
    }).toString();

    router.push(`/hotel/${hotel_id}?${searchQueryParams}`, { scroll: true });
  };

  const toggleLike = (hotel_id: number) => {
    if (likedHotels.includes(hotel_id)) {
      setLikedHotels((prevLikedHotels) =>
        prevLikedHotels.filter((id) => id !== hotel_id)
      );
    } else {
      setLikedHotels((prevLikedHotels) => [...prevLikedHotels, hotel_id]);
    }
  };

  const isHotelLiked = (hotel_id: number) =>
    likedHotels?.includes(hotel_id) || false;

  return (
    <Box
      sx={{
        my: 3,
        borderRadius: 1,
        width: "100%",
        bgcolor: "primary.light",
        minHeight: "300px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          pt: 3,
          pb: 2,
          mx: 2,
        }}
      >
        Khách sạn xung quanh
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
        fullHeightHover={false}
        autoPlay={true}
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
              gap: "16px",
            }}
          >
            {group.map((item: IHotelAround, itemIndex: number) => {
              const hotel_avatar = item?.images?.filter(
                (image: { [key: string]: any }) => {
                  return image.is_primary === true;
                }
              )[0]?.url;

              return (
                <Box
                  key={itemIndex}
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
                  onClick={() => handleNavigate(item.hotel_id)}
                >
                  <Box position="relative">
                    <CardMedia
                      component="img"
                      src={hotel_avatar || FALLBACK_URL.HOTEL_NO_IMAGE}
                      alt={item.name}
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
                      {item.name}
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
                        {item.address}
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
                        {item?.original_room_price !== item?.min_room_price && (
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
                          {formatCurrency(item.min_room_price)}
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

export default HotelsAround;
