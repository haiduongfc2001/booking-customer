"use client";
import React, { FC } from "react";
import {
  Typography,
  Box,
  Grid,
  SelectChangeEvent,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  Card,
  CardContent,
} from "@mui/material";
import { Line, Circle } from "rc-progress";
import ratingCategory from "@/utils/rating-category";
import { sortOptions } from "../../utils/data";
import { getInitials } from "@/utils/get-initials";
import BedIcon from "@mui/icons-material/Bed";
import { STATUS_CODE } from "@/constant/constants";
import { getRequest } from "@/services/api-instance";
import dayjs from "dayjs";
import { useAppDispatch } from "@/redux/store/store";
import { AppDispatch } from "@/redux/store/store";
import { closeLoadingApi, openLoadingApi } from "@/redux/slices/loading-slice";

interface IReplyReview {
  content: string;
  createdAt: number;
  images: string | null;
}

interface IHotelReview {
  id: number;
  username: string | null;
  avatar: string | null;
  title: string;
  content: string;
  rating: number;
  roomName: string;
  travelDate: string;
  publishedDate: string;
  reply: IReplyReview | null;
}

interface RatingLevels {
  FANTASTIC: number;
  VERY_GOOD: number;
  SATISFYING: number;
  AVERAGE: number;
  POOR: number;
}

interface HotelReviewsData {
  // reviews: IHotelReview[];
  // averageRatings: number;
  // totalReviews: number;
  // countByRatingLevel: RatingLevels;
  // name?: string;
  // images?: { url: string }[];
  [key: string]: any;
}

interface IHotelReviews {
  hotelId: number;
  reviewRef: React.RefObject<HTMLDivElement>;
}

const HotelReviews: FC<IHotelReviews> = ({ hotelId, reviewRef }) => {
  const [hotelReviews, setHotelReviews] =
    React.useState<HotelReviewsData | null>(null);

  const dispatch: AppDispatch = useAppDispatch();

  React.useEffect(() => {
    const fetchHotelReviews = async () => {
      dispatch(openLoadingApi());

      try {
        const response = await getRequest(`/review/getHotelReviews/${hotelId}`);

        if (response && response.status === STATUS_CODE.OK) {
          setHotelReviews(response.data);
        }
      } catch (error: any) {
        console.error(error.response?.data?.message || error.message);
      } finally {
        dispatch(closeLoadingApi());
      }
    };

    fetchHotelReviews();
  }, [hotelId]);

  const [sortOption, setSortOption] = React.useState("highest_rating");

  const handleSortOptionChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };

  if (!hotelReviews) {
    return <Typography>No reviews found.</Typography>;
  }

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

  return (
    <>
      {/* <Box sx={{ flex: "1" }}> */}
      <Box sx={{ width: "100%", background: "background.paper", py: 3 }}>
        {/* <Grid
            container
            spacing={2}
            sx={{ width: "100%", background: "background.paper", py: 3 }}
          >
            <Grid item xs={12} lg={7}> */}
        <Box
          ref={reviewRef}
          sx={{
            m: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "23px",
              m: "0 !important",
            }}
          >
            Đánh giá
          </Typography>
        </Box>
        {/* </Grid>
            <Grid item xs={12} lg={5}> */}
        <Box sx={{ width: "100%", m: 0 }}>
          <Box
            sx={{
              border: "1px solid #EDF2F7",
              p: "8px 24px 16px 24px",
              fontSize: "14px",
              boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.05)",
              mt: 2,
              lineHeight: "17px",
              borderRadius: 1,
              bgcolor: "primary.light",
            }}
          >
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Box sx={{ width: 160, height: 160, position: "relative" }}>
                <Circle
                  percent={(hotelReviews?.averageRatings?.overall / 10) * 100}
                  strokeWidth={4}
                  strokeColor="#6366F1"
                  trailWidth={4}
                  trailColor="#e2e8f0"
                  style={{ width: 160, height: 160 }}
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
                    {hotelReviews?.averageRatings?.overall}
                  </Box>
                  <Box component="span" sx={{ fontWeight: "400" }}>
                    {ratingCategory(hotelReviews?.averageRatings?.overall)}
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mr: 8,
                  pr: 8,
                  borderRight: "1px solid gray",
                }}
              >
                {Object.keys(hotelReviews?.countByRatingLevel || {}).map(
                  (key) => {
                    const ratingLevel =
                      hotelReviews?.countByRatingLevel[
                        key as keyof RatingLevels
                      ] || 0;
                    const ratingLevelPercent =
                      (ratingLevel / (hotelReviews?.totalReviews || 1)) * 100;

                    const ratingNames: {
                      [key in keyof RatingLevels]: string;
                    } = {
                      FANTASTIC: "Tuyệt vời",
                      VERY_GOOD: "Rất tốt",
                      SATISFYING: "Tốt",
                      AVERAGE: "Trung bình",
                      POOR: "Kém",
                    };

                    return (
                      <Box
                        key={key}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: "10px",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{ width: "100px", mr: "10px" }}
                        >
                          {ratingNames[key as keyof RatingLevels]}
                        </Box>
                        <Box width={200}>
                          <Line
                            percent={ratingLevelPercent}
                            strokeWidth={4}
                            strokeColor="#6366F1"
                            trailWidth={4}
                            trailColor="#e2e8f0"
                            style={{
                              width: 200,
                              border: "1px solid #777777",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                        <Box
                          component="span"
                          sx={{ textAlign: "right", ml: "10px" }}
                        >
                          {ratingLevel}
                        </Box>
                      </Box>
                    );
                  }
                )}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mr: 8,
                }}
              >
                {ratingData(hotelReviews?.averageRatings).map((rating) => (
                  <Box
                    key={rating.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: "10px",
                    }}
                  >
                    <Box component="span" sx={{ width: "70px", mr: "10px" }}>
                      {rating.criteria}
                    </Box>
                    <Box width={200}>
                      <Line
                        percent={parseFloat(rating.rating) * 10}
                        strokeWidth={4}
                        strokeColor="#718096"
                        trailWidth={4}
                        trailColor="#ffffff"
                        style={{
                          width: 200,
                          border: "1px solid #666666",
                          borderRadius: "4px",
                        }}
                      />
                    </Box>
                    <Box
                      component="span"
                      sx={{ textAlign: "right", ml: "10px" }}
                    >
                      {rating.rating}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        {/* </Grid>
          </Grid> */}
      </Box>
      {/* </Box> */}

      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              borderBottom: "1px solid",
              borderBottomColor: "primary.main ",
              ml: 3,
            }}
          >
            <Typography variant="h6">Sắp xếp&nbsp;&nbsp;</Typography>
            <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
              <Select
                autoWidth
                labelId="select-option-label"
                id="select-option"
                defaultValue="highest_rating"
                sx={{ bgcolor: "background.paper" }}
                value={sortOption}
                onChange={handleSortOptionChange}
              >
                {sortOptions?.map((option) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.textDetail}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ px: 3 }}>
            {hotelReviews?.reviews?.map((review: { [key: string]: any }) => (
              <Box
                key={review?.id}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  bgcolor: "background.paper",
                  mb: 3,
                  p: 3,
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        src={review?.customer.avatar}
                        alt={review?.customer.full_name ?? ""}
                        sx={{
                          color: "primary.main",
                          width: 64,
                          height: 64,
                          display: "flex",
                          fontSize: 24,
                          bgcolor: "primary.light",
                          fontWeight: 600,
                          lineHeight: "28px",
                          mr: 2,
                        }}
                      >
                        {review?.customer.full_name
                          ? getInitials(review?.customer.full_name)
                          : ""}
                      </Avatar>
                      <Box display="flex" flexDirection="column">
                        <Typography variant="h6" component="div">
                          {review?.customer.full_name ?? "Ẩn danh"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {dayjs(review?.created_at).format("DD/MM/YYYY")}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                          <BedIcon sx={{ mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" color="textSecondary">
                            {review?.roomType?.name}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Box display="flex" alignItems="flex-start" mt={1}>
                      <Box
                        sx={{
                          display: "flex",
                          mt: "4px",
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
                          {review?.averageRating}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          {ratingCategory(review?.averageRating)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" gutterBottom mt={2}>
                      {review?.comment}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HotelReviews;
