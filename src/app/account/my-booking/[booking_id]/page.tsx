"use client";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import { Box, Chip, Grid, Icon, Typography } from "@mui/material";
import * as React from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BookingDetails from "@/components/booking/booking-details";
import RoomPricing from "@/components/booking/room-pricing";
import RoomInfo from "@/components/booking/room-info";
import { getRequest } from "@/services/api-instance";
import { FALLBACK_URL, STATUS_CODE } from "@/constant/constants";
import NoBookings from "@/components/account/no-bookings";
import dayjs from "dayjs";
import calculateNumberOfNights from "@/utils/calculate-number-of-nights";
import { getBookingStatusColor } from "@/utils/get-status-color";

interface Booking {
  [key: string]: any;
}

const bookingFake = {
  id: 85,
  code: "20240603094050_6NGS4VGH",
  customer_id: 21,
  check_in: "2024-06-03T07:00:00.000Z",
  check_out: "2024-06-04T05:00:00.000Z",
  note: "",
  total_room_price: 800000,
  tax_and_fee: 160000,
  status: "CANCELLED",
  expires_at: "2024-06-03T02:50:50.261Z",
  created_at: "2024-06-03T02:40:50.265Z",
  updated_at: "2024-06-03T02:51:00.457Z",
  roomBookings: [
    {
      id: 74,
      room_id: 2,
      booking_id: 85,
      num_adults: 1,
      num_children: 0,
      children_ages: [],
      base_price: 1000000,
      surcharge: 0,
      discount: 200000,
      created_at: "2024-06-03T02:40:50.274Z",
      updated_at: "2024-06-03T02:40:50.274Z",
      room: {
        id: 2,
        room_type_id: 1,
        number: "102",
        description: "Standard Room with garden view.",
        status: "AVAILABLE",
        created_at: "2024-05-28T06:38:44.114Z",
        updated_at: "2024-06-03T02:51:00.631Z",
        roomType: {
          id: 1,
          hotel_id: 1,
          name: "Standard Room",
          description: "A cozy room with basic amenities.",
          base_price: 1000000,
          standard_occupant: 3,
          max_children: 2,
          max_occupant: 4,
          max_extra_bed: 1,
          views: ["city view"],
          area: 30,
          created_at: "2024-05-28T06:35:23.786Z",
          updated_at: "2024-05-28T06:35:23.786Z",
          hotel: {
            id: 1,
            name: "Hotel 1",
            street: "123 ABC Street",
            ward: "Ward 1",
            district: "District 1",
            province: "Hà Nội",
            latitude: "10.1234",
            longitude: "20.5678",
            description: "Description of Hotel 1",
            contact: "Contact 1",
            created_at: "2024-05-28T06:28:30.869Z",
            updated_at: "2024-05-28T06:28:30.869Z",
            hotelImages: [
              {
                id: 15,
                hotel_id: 1,
                url: "http://localhost:9000/europetrip/hotels/1/1717238495385_6O6zy0DpRfPk89cP.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio%2F20240603%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240603T025244Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=e61de91620dc81c3b4ed1bb49ce67a36218843fdfa9df63a591f0d004923c987",
                caption: "Caption for image 1",
                is_primary: true,
                created_at: "2024-06-01T10:41:35.397Z",
                updated_at: "2024-06-01T10:41:35.397Z",
              },
              {
                id: 12,
                hotel_id: 1,
                url: "http://localhost:9000/europetrip/hotels/1/1717238479398_gNCEjUI17oIWQxRu.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio%2F20240603%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240603T025244Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=07ccdbce4a70cd59be449bb393788b430313767442042cb5d0e0b71b88f7624e",
                caption: "Caption for image 1",
                is_primary: false,
                created_at: "2024-06-01T10:41:19.454Z",
                updated_at: "2024-06-01T10:41:35.400Z",
              },
              {
                id: 1,
                hotel_id: 1,
                url: "http://localhost:9000/europetrip/hotels/1/1717091783502_ylokpTHyvaf9PBd8.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio%2F20240603%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240603T025244Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=420cce57d14a9db11e0b0186db56b4f7e51c522cafb93fab11b45b8f974fe8b3",
                caption: "Caption for image 1",
                is_primary: false,
                created_at: "2024-05-30T17:56:23.523Z",
                updated_at: "2024-06-01T10:41:35.400Z",
              },
              {
                id: 13,
                hotel_id: 1,
                url: "http://localhost:9000/europetrip/hotels/1/1717238479460_HFfXMPqEE2lLiiL8.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio%2F20240603%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240603T025244Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=9cdba0c3c80468a715719411d49b851cc89c1b3d65badd07a0fb471cc1a9a63e",
                caption: "Caption for image 2",
                is_primary: false,
                created_at: "2024-06-01T10:41:19.468Z",
                updated_at: "2024-06-01T10:41:35.400Z",
              },
              {
                id: 14,
                hotel_id: 1,
                url: "http://localhost:9000/europetrip/hotels/1/1717238479469_keUiY3w9nF9JoNyw.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=minio%2F20240603%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240603T025244Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&X-Amz-Signature=517ddbfe6bf4855416232e6d5c297a2ee300d9e7390ec15d8d7a163440f53c5e",
                caption: "Caption for image 3",
                is_primary: false,
                created_at: "2024-06-01T10:41:19.475Z",
                updated_at: "2024-06-01T10:41:35.400Z",
              },
            ],
          },
        },
      },
    },
  ],
  customer: {
    id: 21,
    full_name: "Đỗ Hải Dương",
    email: "haiduongtb2001@gmail.com",
    password: "$2b$10$338ILf4GPmIDRloi9pbyf.V0./jdrI2hVKpo2j.BDe4mMjfq21Rdy",
    gender: "MALE",
    phone: "",
    dob: "",
    avatar: "1717319922621_w7yikXgH2sGbVKi1.jpg",
    address: "",
    location: "",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImVtYWlsIjoiaGFpZHVvbmd0YjIwMDFAZ21haWwuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzE3MjYyMTI0fQ.CzSl-0WKC7EUBPnEpFntfobA1S-WCig__oJB0--0HkA",
    is_verified: true,
    created_at: "2024-05-28T07:16:36.450Z",
    updated_at: "2024-06-02T09:18:42.642Z",
  },
  translateStatus: "Đã hủy",
  totalAdults: 1,
  totalChildren: 0,
  totalPrice: 960000,
};

export default function BookingDetail(props: any) {
  const [booking, setBooking] = React.useState<Booking>(bookingFake);

  // const { booking_id } = props.params;

  // const initialLoad = React.useRef(true);

  // const fetchBookingDetails = async () => {
  //   try {
  //     const response = await getRequest(
  //       `/booking/${booking_id}/getBookingById`
  //     );

  //     if (response && response.status === STATUS_CODE.OK) {
  //       setBooking(response.data);
  //       // Set other necessary data such as roomInfo and numNights
  //     }
  //   } catch (error: any) {
  //     console.error(error.response?.data?.message || error.message);
  //   }
  // };

  // React.useEffect(() => {
  //   if (initialLoad.current) {
  //     initialLoad.current = false;
  //     return;
  //   }
  //   fetchBookingDetails();
  // }, [booking_id]);

  return (
    <div>
      <Box mx={10} my={4}>
        <CustomizedBreadcrumbs
          newBreadcrumbsData={[
            {
              href: "/account",
              label: "Tài khoản",
              icon: <PersonOutlineOutlinedIcon />,
            },
            {
              label: "Đơn đặt phòng",
              icon: <BorderColorOutlinedIcon />,
            },
          ]}
        />

        {booking ? (
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 2,
              my: 3,
              borderRadius: 1,
            }}
          >
            <Grid container spacing={3}>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon></Icon>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: { xs: "100%", md: "30%" },
                    mb: { xs: 2, md: 0 },
                  }}
                >
                  <Chip
                    label={booking?.translateStatus}
                    color={getBookingStatusColor(booking?.status)}
                    sx={{
                      width: "100%",
                      fontWeight: 700,
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                {(() => {
                  const hotelImages =
                    booking?.roomBookings[0]?.room?.roomType?.hotel
                      ?.hotelImages || [];

                  const primaryImageUrl = hotelImages
                    .filter((hotelImage: any) => hotelImage.is_primary === true)
                    .map((hotelImage: any) => hotelImage.url)
                    .find((url: string) => url);

                  const hotelAvatar =
                    primaryImageUrl || FALLBACK_URL.HOTEL_NO_IMAGE;

                  const hotelName =
                    booking?.roomBookings[0]?.room?.roomType?.hotel?.name ||
                    "N/A";
                  const hotelAddress =
                    booking?.roomBookings[0]?.room?.roomType?.hotel?.address ||
                    "N/A";
                  const roomTypeName =
                    booking?.roomBookings[0]?.room?.roomType?.name || "N/A";
                  const numRooms = booking?.roomBookings?.length || 0;

                  return (
                    <Box
                      sx={{
                        bgcolor: "background.paper",
                        p: 2,
                        mb: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Box display="flex">
                        <div
                          style={{
                            borderRadius: "8px",
                            overflow: "hidden",
                            width: "64px",
                            height: "64px",
                          }}
                        >
                          <img
                            src={hotelAvatar}
                            alt={hotelName}
                            style={{ width: "64px", height: "64px" }}
                          />
                        </div>
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="flex-start"
                          ml={2}
                        >
                          <Typography variant="h6">{hotelName}</Typography>
                          <Typography variant="body2">
                            {hotelAddress}
                          </Typography>
                        </Box>
                      </Box>

                      <Box my={3}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Box
                              display="flex"
                              flexDirection="column"
                              bgcolor="background.paper"
                              p={1}
                              borderRadius={1}
                            >
                              <Typography variant="subtitle1">
                                Nhận phòng
                              </Typography>
                              <Typography variant="body2">
                                {dayjs(booking?.check_in).format("HH:mm")}{" "}
                                &nbsp;{" "}
                                {dayjs(booking?.check_in).format("DD-MM-YYYY")}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box
                              display="flex"
                              flexDirection="column"
                              bgcolor="background.paper"
                              p={1}
                              borderRadius={1}
                            >
                              <Typography variant="subtitle1">
                                Trả phòng
                              </Typography>
                              <Typography variant="body2">
                                {dayjs(booking?.check_out).format("HH:mm")}{" "}
                                &nbsp;{" "}
                                {dayjs(booking?.check_out).format("DD-MM-YYYY")}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Box
                              display="flex"
                              flexDirection="column"
                              bgcolor="background.paper"
                              p={1}
                              borderRadius={1}
                            >
                              <Typography variant="subtitle1">
                                Số đêm
                              </Typography>
                              <Typography variant="body2">
                                {calculateNumberOfNights(
                                  booking?.check_in,
                                  booking?.check_out
                                )}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle1">Số phòng</Typography>
                        <Box display="flex">
                          <Typography
                            variant="body2"
                            sx={{ color: "primary.main", fontWeight: "bold" }}
                          >
                            {numRooms} x&nbsp;
                          </Typography>
                          <Typography variant="body2">
                            {roomTypeName}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })()}
              </Grid>

              {/* <Grid item xs={12} md={5}>
              <RoomInfo roomInfo={roomInfo} booking={booking} />
              <RoomPricing
                numNights={numNights}
                booking={booking}
                roomInfo={roomInfo}
              />
            </Grid> */}
            </Grid>
          </Box>
        ) : (
          <NoBookings />
        )}
      </Box>
    </div>
  );
}
