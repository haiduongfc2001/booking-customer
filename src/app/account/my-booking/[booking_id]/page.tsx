"use client";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  Grid,
  Icon,
  SvgIcon,
  Typography,
} from "@mui/material";
import * as React from "react";
import { getRequest } from "@/services/api-instance";
import {
  BOOKING_STATUS,
  FALLBACK_URL,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  STATUS_CODE,
} from "@/constant/constants";
import NoBookings from "@/components/account/no-bookings";
import dayjs from "dayjs";
import calculateNumberOfNights from "@/utils/calculate-number-of-nights";
import {
  getBookingStatusColor,
  getPaymentStatusColor,
} from "@/utils/get-status-color";
import { formatDateTime, formatDateLocaleVi } from "@/utils/format-date";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { renderBeds } from "@/utils/render-beds";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import formatCurrency from "@/utils/format-currency";
import { ZaloPayIcon } from "@/constant/icons";
import Image from "next/image";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Booking {
  [key: string]: any;
}

export default function BookingDetails(props: any) {
  const [booking, setBooking] = React.useState<Booking>({});

  const { booking_id } = props.params;

  const initialLoad = React.useRef(true);

  const fetchBookingDetails = async () => {
    try {
      const response = await getRequest(
        `/booking/${booking_id}/getBookingById`
      );

      if (response && response.status === STATUS_CODE.OK) {
        setBooking(response.data);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  React.useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    fetchBookingDetails();
  }, [booking_id]);

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        py: 2,
        px: 2,
        my: 3,
        mx: 10,
        borderRadius: 1,
      }}
    >
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Link href={"/account/my-booking"}>
          <Box
            sx={{
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              pb: "20px",
            }}
          >
            <Icon>
              <ArrowBackIcon />
            </Icon>
            <Typography variant="body1">
              &nbsp;Quay lại đơn đặt phòng
            </Typography>
          </Box>
        </Link>
      </Box>
      {booking?.roomBookings?.length > 0 ? (
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
              mb: 2,
            }}
          >
            <Grid
              container
              spacing={2}
              sx={{
                width: "calc(100% + 16px)",
                margin: "-8px",
              }}
            >
              <Grid item xs={12} sm={4} p={1}>
                <Box
                  sx={{
                    display: "flex",
                    padding: "10px 0 0 10px",
                    position: "relative",
                    minHeight: "80px",
                    borderRadius: "8px",
                    flexDirection: "column",
                    bgcolor: "#F7FAFC",
                  }}
                >
                  <Typography variant="body1" pb={1}>
                    Mã đặt phòng
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgb(0, 182, 243)",
                      fontSize: "18px",
                      fontWeight: 600,
                      lineHeight: "21px",
                    }}
                  >
                    {booking.code}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} p={1}>
                <Box
                  sx={{
                    display: "flex",
                    padding: "10px 0 0 10px",
                    position: "relative",
                    minHeight: "80px",
                    borderRadius: "8px",
                    flexDirection: "column",
                    bgcolor: "#F7FAFC",
                  }}
                >
                  <Typography variant="body1" pb={1}>
                    Trạng thái
                  </Typography>
                  <Chip
                    label={booking?.translateStatus}
                    color={getBookingStatusColor(booking?.status)}
                    sx={{
                      width: "90%",
                      fontWeight: 700,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} p={1}>
                <Box
                  sx={{
                    display: "flex",
                    padding: "10px 0 0 10px",
                    position: "relative",
                    minHeight: "80px",
                    borderRadius: "8px",
                    flexDirection: "column",
                    bgcolor: "#F7FAFC",
                  }}
                >
                  <Typography variant="body1" pb={1}>
                    Ngày đặt
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(new Date(booking.created_at))}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {(() => {
              const hotel = booking?.roomBookings[0]?.room?.roomType?.hotel;
              const hotelImages = hotel.hotelImages || [];

              const primaryImageUrl = hotelImages
                .filter((hotelImage: any) => hotelImage.is_primary === true)
                .map((hotelImage: any) => hotelImage.url)
                .find((url: string) => url);

              const hotelAvatar =
                primaryImageUrl || FALLBACK_URL.HOTEL_NO_IMAGE;

              const hotelName = hotel.name || "N/A";
              const hotelAddress =
                `${hotel.street}, ${hotel.ward}, ${hotel.district}, ${hotel.province}` ||
                "N/A";

              return (
                <Grid container spacing={2} mt={2} mb={2}>
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{
                      width: { xs: "150px", md: "100px" },
                      height: { xs: "150px", md: "100px" },
                      objectFit: "cover",
                      borderRadius: 1,
                      display: "flex",
                      justifyContent: { xs: "center" },
                      alignItems: "center",
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={hotelAvatar}
                      alt={
                        booking?.roomBookings[0]?.room?.roomType?.hotel?.name ||
                        "Hotel Image"
                      }
                      sx={{
                        width: { xs: "250px", md: "200px" },
                        height: { xs: "250px", md: "200px" },
                        objectFit: "cover",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="flex-start"
                      alignItems="flex-start"
                      ml={2}
                    >
                      <Typography variant="h6">{hotelName}</Typography>
                      <Typography variant="body2">{hotelAddress}</Typography>

                      <Box my={3}>
                        <Grid container spacing={2} display={"flex"}>
                          <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                              borderLeft: "2px solid",
                              borderLeftColor: "primary.main",
                              pt: "0px !important",
                            }}
                          >
                            <Box
                              display="flex"
                              flexDirection="column"
                              bgcolor="background.paper"
                              p={1}
                              borderRadius={1}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  color: "neutral",
                                  display: "flex",
                                  lineHeight: "17px",
                                  justifyContent: "space-between",
                                  mb: 1,
                                }}
                              >
                                Nhận phòng
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  lineHeight: "17px",
                                }}
                              >
                                {dayjs(booking?.check_in).format("HH:mm")}{" "}
                                &nbsp; {formatDateLocaleVi(booking?.check_in)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                              borderLeft: "2px solid",
                              borderLeftColor: "primary.main",
                              pt: "0px !important",
                            }}
                          >
                            <Box
                              display="flex"
                              flexDirection="column"
                              bgcolor="background.paper"
                              p={1}
                              borderRadius={1}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  color: "neutral",
                                  display: "flex",
                                  lineHeight: "17px",
                                  justifyContent: "space-between",
                                  mb: 1,
                                }}
                              >
                                Trả phòng
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  lineHeight: "17px",
                                }}
                              >
                                {dayjs(booking?.check_out).format("HH:mm")}{" "}
                                &nbsp; {formatDateLocaleVi(booking?.check_out)}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={4}
                            sx={{
                              borderLeft: "2px solid",
                              borderLeftColor: "primary.main",
                              pt: "0px !important",
                            }}
                          >
                            <Box
                              display="flex"
                              flexDirection="column"
                              bgcolor="background.paper"
                              p={1}
                              borderRadius={1}
                            >
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  color: "neutral",
                                  display: "flex",
                                  lineHeight: "17px",
                                  justifyContent: "space-between",
                                  mb: 1,
                                }}
                              >
                                Số đêm
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  lineHeight: "17px",
                                }}
                              >
                                {calculateNumberOfNights(
                                  booking?.check_in,
                                  booking?.check_out
                                )}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              );
            })()}
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={3}></Grid>
            <Grid item xs={9}>
              {(() => {
                const beds = booking?.roomBookings[0]?.room?.roomType?.beds;
                const roomImages =
                  booking?.roomBookings[0]?.room?.roomType?.roomImages || [];

                const primaryImageUrl = roomImages
                  .filter((roomImage: any) => roomImage.is_primary === true)
                  .map((roomImage: any) => roomImage.url)
                  .find((url: string) => url);

                const fallbackUrl = FALLBACK_URL.HOTEL_NO_IMAGE;

                const roomTypeAvatar = primaryImageUrl || fallbackUrl;

                return (
                  <Box p={2} mb={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Box display="flex" flexDirection="column">
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              overflow: "hidden !important",
                              maxWidth: "400px",
                              textOverflow: "ellipsis",

                              fontWeight: 600,
                              lineHeight: "17px",
                              pb: 1,
                            }}
                          >
                            {booking?.roomBookings.length}x&nbsp;
                            {booking?.roomBookings[0]?.room?.roomType?.name}
                          </Box>
                          <Box display="flex" alignItems="center">
                            <PeopleAltIcon fontSize="small" />
                            <Box
                              component="span"
                              sx={{
                                fontSize: "12px",
                                pl: 0.5,
                              }}
                            >
                              {booking?.totalAdults} người lớn
                              {booking?.totalChildren > 0 &&
                                `, ${booking.totalChildren} trẻ em`}
                            </Box>
                          </Box>
                          {beds?.length > 0 && (
                            <Box display="flex" my={1}>
                              <SvgIcon>
                                <SingleBedIcon />
                              </SvgIcon>
                              {renderBeds({
                                beds,
                              })}
                            </Box>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <CardMedia
                          component="img"
                          src={roomTypeAvatar}
                          alt={
                            booking?.roomBookings[0]?.room?.roomType?.name ||
                            "Room Type Image"
                          }
                          sx={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: 1,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                );
              })()}
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={3}></Grid>
            <Grid item xs={9}>
              {(() => {
                const customer = booking?.customer;

                return (
                  <Box display="flex" flexDirection="column" p={2} mb={2}>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        overflow: "hidden !important",
                        maxWidth: "400px",
                        textOverflow: "ellipsis",

                        fontWeight: 600,
                        lineHeight: "17px",
                        pb: 1,
                      }}
                    >
                      Thông tin liên hệ
                    </Box>
                    <Box display="flex" alignItems="center" pt={1}>
                      <PeopleAltIcon fontSize="small" />
                      <Box
                        component="span"
                        sx={{
                          fontSize: "12px",
                          pl: 1,
                        }}
                      >
                        {customer.full_name}
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" pt={1}>
                      <AlternateEmailIcon fontSize="small" />
                      <Box
                        component="span"
                        sx={{
                          fontSize: "12px",
                          pl: 1,
                        }}
                      >
                        {customer.email}
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center" pt={1}>
                      <PhoneAndroidIcon fontSize="small" />
                      <Box
                        component="span"
                        sx={{
                          fontSize: "12px",
                          pl: 1,
                        }}
                      >
                        {customer.phone}
                      </Box>
                    </Box>
                  </Box>
                );
              })()}
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={3}></Grid>
            <Grid item xs={9}>
              {(() => {
                const checkIn = dayjs(booking.check_in).format("YYYY-MM-DD");
                const checkOut = dayjs(booking.check_out).format("YYYY-MM-DD");

                const numNights = calculateNumberOfNights(checkIn, checkOut);

                return (
                  <Box p={2} mb={2}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box display="flex" flexDirection="column">
                          <Box display="flex" alignItems="center">
                            <Typography variant="h6">Tổng tiền</Typography>
                          </Box>
                          <Typography variant="body2">
                            Đã bao gồm thuế, phí, VAT
                          </Typography>
                        </Box>
                        <Typography variant="h6">
                          {formatCurrency(booking.totalPrice)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1">
                          {booking?.roomBookings?.length} phòng x {numNights}{" "}
                          đêm
                        </Typography>
                        <Typography variant="body1">
                          {formatCurrency(booking.total_room_price)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body1">
                          Thuế và phí dịch vụ của khách sạn
                        </Typography>
                        <Typography variant="body1">
                          {formatCurrency(booking.tax_and_fee)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })()}
            </Grid>
          </Grid>

          {booking?.payment && (
            <Grid container spacing={2}>
              <Grid item xs={3}></Grid>
              <Grid item xs={9}>
                <Box p={2} mb={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography variant="subtitle1">
                      Phương thức thanh toán
                    </Typography>
                    <Icon sx={{ mr: 2 }}>
                      {booking?.payment.paymentMethod.code ===
                        PAYMENT_METHODS.ZALOPAY && <ZaloPayIcon />}
                    </Icon>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography variant="subtitle1">Trạng thái</Typography>

                    <Chip
                      label={booking?.payment?.translateStatus}
                      color={getPaymentStatusColor(booking?.payment?.status)}
                      sx={{
                        width: "auto",
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}

          {booking?.status === BOOKING_STATUS.CONFIRMED &&
            booking?.payment?.status === PAYMENT_STATUS.COMPLETED && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Button variant="contained" color="inherit">
                      Hủy đặt phòng
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            )}
        </Grid>
      ) : (
        <NoBookings />
      )}
    </Box>
  );
}
