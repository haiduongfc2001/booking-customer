"use client";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HotelIcon from "@mui/icons-material/Hotel";
import RateReviewIcon from "@mui/icons-material/RateReview";
import formatCurrency from "@/utils/format-currency";
import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Image from "next/image";
import { Line, Circle } from "rc-progress";
import ratingCategory from "@/utils/rating-category";

export default function HotelDetail(props: any) {
  const { location, checkInDate, checkOutDate, numberOfPeople, numberOfRooms } =
    props.searchParams;
  const { hotel_id } = props.params;

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));

  const searchQueryParams = new URLSearchParams({
    location,
    checkInDate,
    checkOutDate,
    numberOfPeople,
    numberOfRooms,
  }).toString();

  // Chuyển đổi các giá trị rating từ chuỗi sang số và tính toán rating trung bình
  const ratings = ratingData.map((item) => parseFloat(item.rating));
  const sum = ratings.reduce((total, rating) => total + rating, 0);
  const averageRating = sum / ratings.length;

  // Làm tròn rating trung bình đến 1 chữ số thập phân và chỉ lấy 1 số sau dấu thập phân
  const formattedRating = averageRating.toFixed(1);

  // Chuyển đổi lại thành số để sử dụng trong tính toán
  const numericRating = parseFloat(formattedRating);

  // Sử dụng numericRating (kiểm tra nếu nó là một số hợp lệ) để tính phần trăm
  const percentRating = isNaN(numericRating) ? 0 : numericRating * 10;

  return (
    <Box mx={10} my={4}>
      <CustomizedBreadcrumbs
        newBreadcrumbsData={[
          {
            label: `${location}`,
            href: `/search?${searchQueryParams}`,
            icon: <LocationOnIcon />,
          },
          {
            label: `${hotelData.name}`,
            icon: <HotelIcon />,
          },
        ]}
      />

      <Box
        sx={{
          color: "#1a202c",
          fontSize: "14px",
          fontWeight: "normal",
          lineHeight: "17px",
          mt: 3,
        }}
      >
        <Box
          sx={{
            borderBottom: "none",
            pb: "0 !important",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            my: 2,
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                margin: "0 0 6px 0",
                fontSize: "24px",
                fontWeight: "600",
                lineHeight: "29px",
              }}
            >
              {hotelData.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 1,
              }}
            >
              <IconButton
                size="small"
                sx={{
                  color: "#FF3366",
                  display: "flex",
                  p: "1px 2px 0 0",
                  fontWeight: "600",
                  mr: "5px",
                  borderRadius: "4px",
                  bgcolor: "rgba(255, 51, 102, 0.1)",
                }}
              >
                <RateReviewIcon />
                {numericRating}
              </IconButton>
              {ratingCategory(numericRating)}
              <Box
                component="span"
                sx={{
                  color: "#4A5568",
                  ml: "5px",
                }}
              >
                (100 đánh giá)
              </Box>
              <Button
                color="primary"
                aria-label="Xem dánh giá"
                sx={{
                  p: "5px",
                  minHeight: "auto",
                }}
              >
                Xem đánh giá
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{
                  mr: "5px",
                }}
                size="small"
              >
                <LocationOnIcon />
              </IconButton>
              <Box component="span">{hotelData.address}</Box>
              <Button
                color="primary"
                aria-label="Xem bản đồ"
                sx={{
                  p: "5px",
                  minHeight: "auto",
                }}
              >
                Xem bản đồ
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "12px",
                  lineHeight: "18px",
                  fontWeight: 400,
                  color: "rgb(115, 115, 115)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: 1,
                }}
              >
                từ
              </Typography>
              <Box
                component="span"
                sx={{
                  fontSize: "20px",
                  fontWeight: "600",
                  lineHeight: "24px",
                }}
              >
                {formatCurrency(hotelData.roomList[0].price)}
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{
                ml: 2,
              }}
            >
              Chọn phòng
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "100%",
            overflowY: "auto",
            maxHeight: 328,
          }}
        >
          <ImageList variant="quilted" cols={4} gap={8} rowHeight={160}>
            {hotelData.images.map((image, index) => (
              <ImageListItem
                key={image.id}
                cols={index === 0 ? 2 : 1}
                rows={index === 0 ? 2 : 1}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <Image
                    loading="lazy"
                    layout="fill"
                    objectFit="cover"
                    // loader={() => image.url}
                    src={image.url}
                    alt={image.caption}
                    style={{ borderRadius: "8px" }}
                  />
                </div>
                <ImageListItemBar
                  sx={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  title={image.caption}
                  position="bottom"
                  actionIcon={
                    <IconButton
                      sx={{ color: "white" }}
                      aria-label={`star ${image.caption}`}
                    >
                      <StarBorderIcon />
                    </IconButton>
                  }
                  actionPosition="left"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>

        <Box my={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  borderRadius: 1,
                  borderColor: "rgb(221, 223, 226)",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  p: 2,
                  boxShadow: "none",
                  m: 0,
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h6" mb={1}>
                  Mô tả khách sạn
                </Typography>
                <Typography variant="body2">{hotelData.description}</Typography>
              </Box>
              <Box
                sx={{
                  borderRadius: 1,
                  borderColor: "rgb(221, 223, 226)",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  p: 2,
                  boxShadow: "none",
                  mt: 3,
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h6" mb={1}>
                  Đánh giá
                </Typography>
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
                          {rating.rating}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  borderRadius: 1,
                  borderColor: "rgb(221, 223, 226)",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  p: 2,
                  boxShadow: "none",
                  m: 0,
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h6">Tiện nghi khách sạn</Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: "192px",
                    display: "flex",
                    flexWrap: "wrap",
                    mt: "12px",
                  }}
                >
                  {amenitiesData?.map((amenity) => (
                    <Box
                      key={amenity.id}
                      sx={{
                        width: isMd ? "50%" : "33.33%",
                        display: "flex",
                        p: "12px 7px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircleOutlineIcon sx={{ color: "primary.main" }} />
                      <Box
                        component="span"
                        sx={{
                          display: "-webkit-box",
                          overflow: "hidden",
                          minWidth: "85px",
                          textAlign: "center",
                          webkitBoxOrient: "vertical",
                          webkitLineClamp: 2,
                          ml: 0.5,
                        }}
                      >
                        {amenity.name}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* <List>
        <ListItem>location : {location}</ListItem>
        <ListItem>checkInDate : {checkInDate}</ListItem>
        <ListItem>checkOutDate : {checkOutDate}</ListItem>
        <ListItem>numberOfPeople : {numberOfPeople}</ListItem>
        <ListItem>numberOfRooms : {numberOfRooms}</ListItem>
      </List> */}
    </Box>
  );
}

const hotelData = {
  id: 10,
  name: "The Empyrean Nha Trang",
  address: "2, Nguyễn Thị Minh Khai, Thành Phố Nha Trang, Khánh Hòa",
  location: "Uua9D5ba",
  description: "Modern hotel with city views.",
  contact: "0123456789",
  created_at: "2024-03-06T06:21:22.643Z",
  updated_at: "2024-03-22T14:47:46.034Z",
  images: [
    {
      id: 45,
      url: "https://gcs.tripi.vn/hms_prod/photo/thumb/1616771153173ME/outside.png",
      caption: "Caption for image 1",
      is_primary: false,
    },
    {
      id: 46,
      url: "https://gcs.tripi.vn/hms_prod/photo/img/470238wvF/dji_0056.jpg",
      caption: "Caption for image 2",
      is_primary: false,
    },
    {
      id: 47,
      url: "https://gcs.tripi.vn/hms_prod/photo/thumb/1617174369612dF/172059893.jpg",
      caption: "Caption for image 3",
      is_primary: true,
    },
    {
      id: 48,
      url: "https://gcs.tripi.vn/hms_prod/photo/thumb/1616819671281ZO/40510723.png",
      caption: "Caption for image 4",
      is_primary: false,
    },
    {
      id: 49,
      url: "https://gcs.tripi.vn/hms_prod/photo/thumb/2685xI/ecea6c41b2d197bd06460bee7ab542b0.jpg",
      caption: "Caption for image 5",
      is_primary: false,
    },
  ],
  roomList: [
    {
      id: 64,
      number: "101",
      type: "single",
      price: 600000,
      discount: 100000,
      capacity: 2,
      description: "A cozy single room with a view.",
      rating_average: "0.0",
      status: "available",
      images: [],
    },
    {
      id: 65,
      number: "102",
      type: "double",
      price: 700000,
      discount: 150000,
      capacity: 3,
      description: "Spacious double room with twin beds.",
      rating_average: "0.0",
      status: "unavailable",
      images: [],
    },
    {
      id: 66,
      number: "103",
      type: "suite",
      price: 800000,
      discount: 200000,
      capacity: 4,
      description: "Luxurious suite with a living area.",
      rating_average: "0.0",
      status: "available",
      images: [],
    },
    {
      id: 67,
      number: "104",
      type: "single",
      price: 550000,
      discount: 80000,
      capacity: 2,
      description: "Compact single room with modern amenities.",
      rating_average: "0.0",
      status: "available",
      images: [],
    },
    {
      id: 68,
      number: "105",
      type: "double",
      price: 650000,
      discount: 120000,
      capacity: 3,
      description: "Double room with a balcony overlooking the city.",
      rating_average: "0.0",
      status: "unavailable",
      images: [],
    },
    {
      id: 69,
      number: "106",
      type: "suite",
      price: 750000,
      discount: 180000,
      capacity: 4,
      description: "Elegant suite with separate living and sleeping areas.",
      rating_average: "0.0",
      status: "available",
      images: [],
    },
    {
      id: 70,
      number: "107",
      type: "single",
      price: 580000,
      discount: 90000,
      capacity: 2,
      description: "Comfortable single room with a work desk.",
      rating_average: "0.0",
      status: "unavailable",
      images: [],
    },
    {
      id: 71,
      number: "108",
      type: "double",
      price: 680000,
      discount: 130000,
      capacity: 3,
      description: "Modern double room with city views.",
      rating_average: "0.0",
      status: "available",
      images: [],
    },
    {
      id: 72,
      number: "109",
      type: "suite",
      price: 780000,
      discount: 190000,
      capacity: 4,
      description: "Spacious suite with luxurious amenities.",
      rating_average: "0.0",
      status: "available",
      images: [],
    },
    {
      id: 73,
      number: "110",
      type: "single",
      price: 570000,
      discount: 85000,
      capacity: 2,
      description: "Cozy single room with a comfortable bed.",
      rating_average: "0.0",
      status: "unavailable",
      images: [],
    },
    {
      id: 81,
      number: "601",
      type: "Penthouse",
      price: 5000000,
      discount: 900000,
      capacity: 2,
      description: "Luxurious penthouse suite",
      rating_average: "5.0",
      status: "available",
      images: [],
    },
  ],
};

const amenitiesData = [
  {
    id: 1,
    url: "https://storage.googleapis.com/tripi-assets/images/hotel/amenity/payment_jcb.png",
    name: "Wifi miễn phí",
  },
  {
    id: 2,
    url: "https://storage.googleapis.com/tripi-assets/images/hotel/amenity/payment_jcb.png",
    name: "Wifi miễn phí",
  },
  {
    id: 3,
    url: "https://storage.googleapis.com/tripi-assets/images/hotel/amenity/payment_jcb.png",
    name: "Wifi miễn phí",
  },
  {
    id: 4,
    url: "https://storage.googleapis.com/tripi-assets/images/hotel/amenity/payment_jcb.png",
    name: "Wifi miễn phí",
  },
  {
    id: 5,
    url: "https://storage.googleapis.com/tripi-assets/images/hotel/amenity/payment_jcb.png",
    name: "Wifi miễn phí",
  },
  {
    id: 6,
    url: "https://storage.googleapis.com/tripi-assets/images/hotel/amenity/payment_jcb.png",
    name: "Wifi miễn phí",
  },
  {
    id: 7,
    url: "https://storage.googleapis.com/tripi-assets/images/hotel/amenity/payment_jcb.png",
    name: "Wifi miễn phí",
  },
  {
    id: 8,
    url: "https://storage.googleapis.com/tripi-assets/images/hotel/amenity/payment_jcb.png",
    name: "Wifi miễn phí",
  },
];

const ratingData = [
  {
    id: 1,
    criteria: "Vị trí",
    rating: "8.4",
  },
  {
    id: 2,
    criteria: "Giá cả",
    rating: "8.6",
  },
  {
    id: 3,
    criteria: "Phục vụ",
    rating: "8.5",
  },
  {
    id: 4,
    criteria: "Vệ sinh",
    rating: "8.0",
  },
  {
    id: 5,
    criteria: "Tiện nghi",
    rating: "9.2",
  },
];
