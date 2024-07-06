"use client";
import { FC } from "react";
import * as React from "react";
import {
  Box,
  CardMedia,
  Grid,
  IconButton,
  Pagination,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import formatCurrency from "@/utils/format-currency";
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  ALERT_TYPE,
  FALLBACK_URL,
  PAGINATION,
  STATUS_CODE,
} from "@/constant/constants";
import { postRequest } from "@/services/api-instance";
import {
  AppDispatch,
  useAppDispatch,
  useAppSelector,
} from "@/redux/store/store";
import { openAlert } from "@/redux/slices/alert-slice";
import { RootState } from "@/redux/store/store";
import CustomizedTabs, { StyledTab, StyledTabs } from "@/lib/tabs";
import CustomizedSortOptionTabs from "./sort-search-result";
import ratingCategory from "@/utils/rating-category";

interface SearchResultProps {
  location: string;
  checkIn: Dayjs;
  checkOut: Dayjs;
  numAdults: number;
  numChildren: number;
  childrenAges: any[];
  numRooms: number;
  hotelSearchResults: { [key: string]: any };
  customer_id: string | number | null;
  page: number;
  handleChangePage: any;
  [key: string]: any;
}

interface IHotel {
  [key: string]: string | number;
}

const sortOptions = [
  { id: 1, label: "Phù hợp nhất", value: "RELEVANT" },
  { id: 2, label: "Rẻ nhất", value: "CHEAPEST" },
  { id: 3, label: "Đắt nhất", value: "MOST_EXPENSIVE" },
  { id: 4, label: "Xếp hạng sao", value: "STAR_RATING" },
  { id: 5, label: "Đánh giá cao nhất", value: "HIGHEST_RATED" },
];

const SearchResult: FC<SearchResultProps> = ({
  location = "",
  checkIn = dayjs().add(5, "day"),
  checkOut = dayjs().add(6, "day"),
  numAdults = 1,
  numChildren = 0,
  childrenAges = [],
  numRooms = 1,
  hotelSearchResults = {},
  customer_id = null,
  page = 1,
  setPage,
  handleChangePage = () => {},
  sortOption = "RELEVANT",
  setSortOption,
}) => {
  const router = useRouter();
  const [likedHotels, setLikedHotels] = React.useState<number[]>([]);

  const dispatch: AppDispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.auth.isLoggedIn
  );

  const handleNavigate = (hotel_id: number) => {
    const formattedCheckIn = checkIn.format("YYYY-MM-DD");
    const formattedCheckOut = checkOut.format("YYYY-MM-DD");

    const searchQueryParams = new URLSearchParams({
      location,
      checkIn: formattedCheckIn,
      checkOut: formattedCheckOut,
      numAdults: String(numAdults),
      numChildren: String(numChildren),
      childrenAges: String(childrenAges),
      numRooms: String(numRooms),
    }).toString();

    router.push(`/hotel/${hotel_id}?${searchQueryParams}`, { scroll: true });
  };

  React.useEffect(() => {
    // Lọc ra danh sách các hotel đã được yêu thích ban đầu
    const initialLikedHotels = hotelSearchResults?.items
      .filter((hotel: IHotel) => hotel?.is_favorite_hotel)
      .map((hotel: { [key: string]: any }) => hotel?.id);
    setLikedHotels(initialLikedHotels);
  }, []);

  const addFavoriteHotel = async (hotelId: number) => {
    try {
      const response = await postRequest(`/customer/addFavoriteHotel`, {
        customer_id,
        hotel_id: hotelId,
      });
      if (response?.status === 201) {
        setLikedHotels((prevLikedHotels) => [...prevLikedHotels, hotelId]);
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
        setLikedHotels((prevLikedHotels) =>
          prevLikedHotels.filter((id) => id !== hotelId)
        );
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
    if (!isLoggedIn && !customer_id) {
      dispatch(
        openAlert({
          type: ALERT_TYPE.WARNING,
          message: "Vui lòng đăng nhập để thêm yêu thích.",
        })
      );
      return;
    }

    if (likedHotels.includes(hotelId)) {
      setLikedHotels((prevLikedHotels) =>
        prevLikedHotels.filter((id) => id !== hotelId)
      );
      removeFavoriteHotel(hotelId);
    } else {
      setLikedHotels((prevLikedHotels) => [...prevLikedHotels, hotelId]);
      addFavoriteHotel(hotelId);
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
          {`Có ${hotelSearchResults?.total ?? 0} khách sạn ở ${location}`}
        </Typography>
      </Box>

      {/* <Box
        width="100%"
        height="100px"
        m={2}
        p={2}
        bgcolor="background.paper"
        borderRadius="8px"
        display="flex"
        justifyContent="center"
        flexDirection="row"
      > */}
      <CustomizedSortOptionTabs
        tabs={sortOptions}
        sortOption={sortOption}
        setSortOption={setSortOption}
        setPage={setPage}
      />
      {/* </Box> */}

      <Grid container spacing={3}>
        {/* Display hotels as cards */}
        {hotelSearchResults?.items.map((hotel: { [key: string]: any }) => {
          const hotelAvatar =
            hotel?.images?.find((image: any) => image.is_primary === true)
              ?.url || FALLBACK_URL.HOTEL_NO_IMAGE;

          const discountPercent = Math.floor(
            (1 - hotel.min_room_price / hotel.original_room_price) * 100
          );

          return (
            <Grid item xs={12} key={hotel?.id}>
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
                onClick={() => handleNavigate(hotel?.id)}
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
                      src={hotelAvatar}
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
                        "&:hover, &:focus": {
                          backgroundColor: "rgba(0, 0, 0, 0.08)",
                        },
                        "&:hover svg": {
                          color: "red",
                          transition: "color 0.2s ease",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(hotel?.id);
                      }}
                    >
                      <FavoriteIcon
                        sx={{
                          fill: isHotelLiked(hotel?.id) ? "red" : "neutral.900",
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
                        {hotel?.name}
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
                          {hotel?.address}
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
                              {ratingCategory(hotel?.averageRatings || 0)}
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
                      {hotel?.min_room_price !== hotel?.original_room_price && (
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "flex-end",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              color: "#ffffff",
                              p: "2px 4px",
                              position: "relative",
                              background: "#6366F1",
                              fontWeight: 600,
                              borderRadius: "3px 3px 0 3px",
                              mb: 1,
                            }}
                          >
                            {discountPercent} %
                            <Box
                              component="span"
                              sx={{
                                position: "absolute",
                                right: 0,
                                bottom: "-4px",
                                width: 0,
                                height: 0,
                                borderColor:
                                  "transparent #6366F1 transparent transparent",
                                borderStyle: "solid",
                                borderWidth: "0 5px 5px 0",
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              color: "#718096",
                              textDecoration: "line-through",
                              cursor: "pointer",
                              mb: 1,
                              fontWeight: 600,
                            }}
                            component="span"
                          >
                            {formatCurrency(hotel?.original_room_price)}
                          </Typography>
                        </Box>
                      )}
                      <Typography
                        variant="h5"
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
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {hotelSearchResults?.items?.length > 0 && (
        <Stack spacing={2} my={2} direction="row" justifyContent="center">
          <Pagination
            showFirstButton
            showLastButton
            defaultPage={Math.min(
              1,
              Math.ceil(hotelSearchResults?.total / PAGINATION.PAGE_SIZE)
            )}
            boundaryCount={2}
            count={
              Math.ceil(hotelSearchResults?.total / PAGINATION.PAGE_SIZE) || 1
            }
            color="primary"
            page={page}
            onChange={handleChangePage}
          />
        </Stack>
      )}
    </Box>
  );
};

export default SearchResult;
