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
  Button,
} from "@mui/material";
import { Line, Circle } from "rc-progress";
import ratingCategory from "@/utils/rating-category";
import { hotelData, ratingData, sortOptions } from "../../utils/data";
import { getInitials } from "@/utils/get-initials";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { formatDate } from "@/utils/format-date";
import BedIcon from "@mui/icons-material/Bed";
import { RATING_CATEGORIES } from "@/constant/constants";

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

interface ICountByRatingLevel {
  value: string;
  name: string;
  count: number;
}

interface IHotelReviews {
  hotelReviews: IHotelReview[];
  numericRating: number;
  percentRating: number;
  countByRatingLevel: ICountByRatingLevel[];
}

const HotelReviews: FC<IHotelReviews> = ({
  hotelReviews,
  numericRating,
  percentRating,
  countByRatingLevel,
}) => {
  const ratings = countByRatingLevel.map((item) => item.count);
  const totalReviews = ratings?.reduce((total, rating) => total + rating, 0);

  const [sortOption, setSortOption] = React.useState("highest_rating");

  const handleSortOptionChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value as string);
  };

  return (
    <>
      <Box sx={{ flex: "1" }}>
        <Box
          sx={{
            width: "100%",
            background: "background.paper",
            py: 3,
          }}
        >
          <Box
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
          <Box
            sx={{
              width: "100%",
              m: 0,
            }}
          >
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
                <Box
                  sx={{
                    width: 160,
                    height: 160,
                    position: "relative",
                  }}
                >
                  <Circle
                    percent={percentRating}
                    strokeWidth={4}
                    strokeColor="#6366F1"
                    trailWidth={4}
                    trailColor="#e2e8f0"
                    style={{
                      width: 160,
                      height: 160,
                    }}
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
                      {numericRating}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        fontWeight: "400",
                      }}
                    >
                      {ratingCategory(numericRating)}
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
                  {countByRatingLevel.map((ratingLevel) => {
                    const ratingLevelPercent =
                      (ratingLevel.count / totalReviews) * 100;

                    return (
                      <Box
                        key={ratingLevel.value}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: "10px",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: "100px",
                            mr: "10px",
                          }}
                        >
                          {ratingLevel.name}
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
                            }}
                          />
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            textAlign: "right",
                            ml: "10px",
                          }}
                        >
                          {ratingLevel.count}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    mr: 8,
                  }}
                >
                  {ratingData.map((rating) => (
                    <Box
                      key={rating.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: "10px",
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: "70px",
                          mr: "10px",
                        }}
                      >
                        {rating.criteria}
                      </Box>
                      <Box width={200}>
                        <Line
                          percent={parseFloat(rating.rating) * 10}
                          strokeWidth={4}
                          strokeColor="#718096"
                          trailWidth={4}
                          trailColor="#e2e8f0"
                          style={{
                            width: 200,
                          }}
                        />
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          textAlign: "right",
                          ml: "10px",
                        }}
                      >
                        {rating.rating}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

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
                id="sselect-option"
                defaultValue="highest_rating"
                sx={{
                  bgcolor: "background.paper",
                }}
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

          <Grid item xs={12} sx={{ pt: "0px !important" }}>
            {hotelReviews?.map((review) => (
              <Grid
                container
                key={review.id}
                spacing={2}
                sx={{
                  mt: 2,
                  ml: 1,
                  borderBottom: "2px solid",
                  borderBottomColor: "primary.light",
                  pb: "12px",
                  "&>.MuiGrid-item": {
                    pt: "0px !important",
                  },
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={3}
                  sx={{
                    display: {
                      xs: "flex",
                      md: "block",
                    },
                    mb: 2,
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                  >
                    <Avatar
                      src={review?.avatar ? review.avatar : ""}
                      sx={{
                        bgcolor: "primary.light",
                        color: "primary.main",
                        width: 64,
                        height: 64,
                        border: "2px solid",
                        borderColor: "primary.main",
                      }}
                    >
                      {getInitials(review?.username)}
                    </Avatar>
                    <Box sx={{ ml: "12px" }}>
                      <Typography variant="subtitle1">
                        {review.username}
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box
                          sx={{
                            color: "#4A5568",
                            display: "flex",
                            fontSize: "12px",
                            alignItems: "center",
                            lineHeight: "14px",
                            pt: "8px",
                          }}
                        >
                          <BorderColorOutlinedIcon fontSize="small" />
                          <Typography sx={{ ml: 1 }}>
                            {formatDate(new Date(review.publishedDate))}
                          </Typography>
                        </Box>
                        {review.roomName && (
                          <Box
                            sx={{
                              color: "#4A5568",
                              display: "flex",
                              fontSize: "12px",
                              alignItems: "center",
                              lineHeight: "14px",
                              pt: "8px",
                            }}
                          >
                            <BedIcon fontSize="small" />
                            <Typography
                              sx={{
                                ml: 1,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 1,
                                maxWidth: "100%",
                                textOverflow: "ellipsis",
                                lineHeight: 1.5,
                                maxHeight: "1.5em",
                              }}
                            >
                              {review.roomName}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        lineHeight: "20px",
                      }}
                    >
                      {review.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          mr: 0.5,
                          color: "neutral.50",
                          display: "flex",
                          p: "2px 6px",
                          fontSize: "12px",
                          background: "#6366F1",
                          alignItems: "center",
                          fontWeight: 600,
                          lineHeight: "14px",
                          borderRadius: "4px",
                          justifyContent: "center",
                        }}
                      >
                        {review.rating}
                      </Typography>
                      &nbsp;
                      {review.rating >= 9 &&
                        review.rating <= 10 &&
                        RATING_CATEGORIES.AMAZING}
                      {review.rating >= 8 &&
                        review.rating < 9 &&
                        RATING_CATEGORIES.VERY_GOOD}
                      {review.rating >= 7 &&
                        review.rating < 8 &&
                        RATING_CATEGORIES.GOOD}
                      {review.rating >= 6 &&
                        review.rating < 7 &&
                        RATING_CATEGORIES.SATISFIED}
                      {review.rating >= 1 &&
                        review.rating < 6 &&
                        RATING_CATEGORIES.UNSATISFIED}
                      {review.rating < 1 ||
                        (review.rating > 10 && "Không hợp lệ")}
                    </Box>
                    <Box
                      sx={{
                        fontSize: "14px",
                        mt: 1,
                        wordBreak: "break-word",
                        fontWeight: 400,
                        lineHeight: "24px",
                      }}
                    >
                      {review.content}
                    </Box>
                    <Box sx={{ m: " 0 -6px", pt: 1 }} />

                    {review.reply && (
                      <Box
                        sx={{
                          display: "flex",
                          p: "18px",
                          position: "relative",
                          borderRadius: 1,
                          bgcolor: "primary.light",
                        }}
                      >
                        <Box
                          sx={{
                            top: "-7px",
                            left: "26px",
                            width: "14px",
                            height: "14px",
                            position: "absolute",
                            transform: "rotate(45deg)",
                            bgcolor: "primary.light",
                            borderRadius: 1,
                          }}
                        />
                        <Avatar
                          src={hotelData?.images[0]?.url}
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 1.5,
                          }}
                        />
                        <Box display="flex" flexDirection="column">
                          <Box component="span" fontWeight={600}>
                            {hotelData?.name}
                          </Box>
                          <Box
                            component="span"
                            sx={{
                              color: "rgb(74, 85, 104)",
                              p: "4px 0px 12px",
                              fontSize: "12px",
                            }}
                          >
                            {formatDate(review?.reply?.createdAt)}
                          </Box>
                          <Box
                            sx={{
                              fontSize: "14px",
                              wordBreak: "break-word",
                              lineHeight: "22px",
                              fontWeight: 400,
                            }}
                          >
                            {review?.reply?.content
                              .split("\n")
                              .map((line, index) => (
                                <React.Fragment key={index}>
                                  {line}
                                  <br />
                                </React.Fragment>
                              ))}
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Grid>
              </Grid>
            ))}

            {hotelReviews?.length > 10 && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  pt: "12px",
                  justifyContent: "center",
                }}
              >
                <Button variant="outlined" color="primary" size="small">
                  Xem tất cả đánh giá
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HotelReviews;
