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

  const { data, error, isLoading } = useCustomAPI(
    API.HOTEL.GET_OUTSTANDING_HOTELS
  );

  const [outstandingHotels, setOutStandingHotels] = useState<
    IOutstandingHotel[]
  >([]);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [likedHotels, setLikedHotels] = useState<number[]>([]);

  useEffect(() => {
    if (data) {
      setOutStandingHotels(data.data);
    }
  }, [data]);

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
    if (Array.isArray(outstandingHotels)) {
      const initialLikedHotels = outstandingHotels
        .map((hotel: IOutstandingHotel) => hotel.hotel_id)
        .filter((hotelId: number) => likedHotels.includes(hotelId));
      setLikedHotels(initialLikedHotels);
    }
  }, [outstandingHotels]);

  if (!outstandingHotels) {
    return <SkeletonLoading itemsPerPage={itemsPerPage} />;
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
    return <SkeletonLoading itemsPerPage={itemsPerPage} />;
  }

  const groupedItems = [];
  for (let i = 0; i < outstandingHotels.length; i += itemsPerPage) {
    groupedItems.push(outstandingHotels.slice(i, i + itemsPerPage));
  }

  const extractCityFromAddress = (address: string): string => {
    const parts = address.split(",");
    return parts[parts.length - 1].trim();
  };

  const handleNavigate = (hotel_id: number) => {
    const hotel = outstandingHotels.find(
      (hotel: IOutstandingHotel) => hotel.id === hotel_id
    );
    if (!hotel) {
      console.error(`Hotel with ID ${hotel_id} not found`);
      return;
    }

    const city = extractCityFromAddress(hotel.hotel_address);

    const searchQueryParams = new URLSearchParams({
      location: city,
      checkIn: dayjs().format("YYYY-MM-DD"),
      checkOut: dayjs().add(1, "day").format("YYYY-MM-DD"),
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

  const isHotelLiked = (hotel_id: number) => likedHotels.includes(hotel_id);

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
            {group.map((item: IOutstandingHotel, itemIndex: number) => {
              const hotel_avatar = item?.hotelImages?.filter(
                (image: { [key: string]: any }) => {
                  return image.is_primary === true;
                }
              )[0]?.url;
              const hotel_address = `${item.street}, ${item.ward}, ${item.district}, ${item.province}`;

              return (
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
                  onClick={() => handleNavigate(item?.id)}
                >
                  <Box position="relative">
                    <CardMedia
                      component="img"
                      src={hotel_avatar || FALLBACK_URL.HOTEL_NO_IMAGE}
                      alt={item?.name}
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
                        toggleLike(item?.id);
                      }}
                    >
                      <FavoriteIcon
                        sx={{
                          fill: isHotelLiked(item?.id) ? "red" : "neutral.900",
                          stroke: "#ffffff",
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
                      {item?.name}
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

                    {item?.totalReviews !== 0 && (
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
                            {item?.averageRatings}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ ml: 1, fontWeight: 600, color: "#333" }}
                          >
                            {ratingCategory(item?.averageRatings)}
                          </Typography>
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            color: "#757575",
                            ml: "5px",
                          }}
                        >
                          ({item?.totalReviews} đánh giá)
                        </Box>
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
                            {formatCurrency(item?.original_room_price)}
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
                          {formatCurrency(item?.min_room_price)}
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
