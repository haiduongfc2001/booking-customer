"use client";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  Grid,
  Icon,
  IconButton,
  SvgIcon,
  Typography,
} from "@mui/material";
import * as React from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { getRequest } from "@/services/api-instance";
import {
  BOOKING_STATUS,
  FALLBACK_URL,
  PAYMENT_METHODS,
  STATUS_CODE,
} from "@/constant/constants";
import NoBookings from "@/components/account/no-bookings";
import dayjs from "dayjs";
import calculateNumberOfNights from "@/utils/calculate-number-of-nights";
import {
  getBookingStatusColor,
  getPaymentStatusColor,
} from "@/utils/get-status-color";
import { formatDateLocaleVi } from "@/utils/format-date";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { renderBeds } from "@/utils/render-beds";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import formatCurrency from "@/utils/format-currency";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { ZaloPayIcon } from "@/constant/icons";
import Image from "next/image";
import Link from "next/link";

interface Booking {
  [key: string]: any;
}
interface Payment {
  [key: string]: any;
}

/**
 * Component này nhận một đối tượng `props` và trả về một giao diện người dùng để hiển thị thông tin đặt phòng chi tiết.
 *
 * URL ví dụ để truy cập vào trang này có dạng:
 * https://90a2-118-70-129-28.ngrok-free.app/hotel/booking/payment?
 * &paymentmethod=ZALOPAY
 * &amount=1440000
 * &appid=2554
 * &apptransid=240603_118206
 * &bankcode=
 * &checksum=d2ceedab919559df17075bb42b83ba027bbb37d5d0ae6da691bec833fe01af68
 * &discountamount=0
 * &pmcid=38
 * &status=1
 *
 * Các tham số trong URL:
 * - `paymentmethod`: Phương thức thanh toán (ở đây là ZaloPay).
 * - `amount`: Số tiền thanh toán (ở đây là 1,440,000 VND).
 * - `appid`: ID của ứng dụng (ở đây là 2554).
 * - `apptransid`: ID giao dịch của ứng dụng (ở đây là 240603_118206).
 * - `bankcode`: Mã ngân hàng (có thể trống nếu không áp dụng).
 * - `checksum`: Chuỗi kiểm tra (đảm bảo tính toàn vẹn của dữ liệu).
 * - `discountamount`: Số tiền giảm giá (ở đây là 0).
 * - `pmcid`: ID phương thức thanh toán (ở đây là 38).
 * - `status`: Trạng thái thanh toán (ở đây là 1, cho biết thanh toán thành công).
 *
 * Dưới đây là mã để hiển thị thông tin chi tiết của đơn đặt phòng, bao gồm hình ảnh, thông tin khách sạn, và thông tin đặt phòng.
 */

export default function UpdateBookingStatus(props: any) {
  const [booking, setBooking] = React.useState<Booking>({});
  const [payment, setPayment] = React.useState<Payment>({});
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const { apptransid } = props.searchParams;

  const fetchBookingDetails = async () => {
    try {
      const response = await getRequest(
        `/payment/zalopay/orderStatus/${apptransid}`
      );

      if (response && response.status === STATUS_CODE.OK) {
        setPayment(response.data);
        setBooking(response.data?.bookingInfo);

        if (response.details.return_code === 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Immediately fetch the data
    fetchBookingDetails();

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up the interval to fetch data every 2000 milliseconds
    intervalRef.current = setInterval(fetchBookingDetails, 2000);

    // Clean up interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [apptransid]);

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "100%", md: "70%" },
        margin: "auto",
      }}
    >
      <Box mx={10} my={4}>
        <CustomizedBreadcrumbs
          newBreadcrumbsData={[
            {
              href: "/account",
              label: "Tài khoản",
              icon: <PersonOutlineOutlinedIcon />,
            },
            {
              href: "/account/my-booking",
              label: "Đơn đặt phòng",
              icon: <BorderColorOutlinedIcon />,
            },
          ]}
        />

        {payment && booking?.roomBookings?.length > 0 ? (
          <Box
            sx={{
              bgcolor: "background.paper",
              py: 2,
              px: 2,
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
                  p: 2,
                  mb: 2,
                }}
              >
                <Image
                  src={
                    booking?.status === BOOKING_STATUS.CANCELLED
                      ? "/images/Y6ez38CH2M.gif"
                      : booking?.status === BOOKING_STATUS.CONFIRMED
                      ? "/images/success.gif"
                      : "/images/pending.png"
                  }
                  alt="booking-status"
                  width="120"
                  height="120"
                  loading="lazy"
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: { xs: "100%", sm: "60%", md: "40%" },
                    mb: { xs: 2, md: 0 },
                    mt: 1,
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
                <Box
                  sx={{
                    color: "rgb(72, 187, 120)",
                    border: "1px solid rgb(72, 187, 120)",
                    padding: "2px 4px",
                    lineHeight: "17px",
                    borderRadius: "4px",
                    mt: 2,
                  }}
                >
                  Mã đặt phòng: {booking?.code}
                </Box>
              </Grid>

              <Box
                sx={{
                  width: "calc(100% + 32px)",
                  mr: "12px",
                  ml: "24px",
                  height: "2px",
                  bgcolor: "neutral.200",
                }}
              />

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

                  return (
                    <Grid container spacing={2} p={2} mb={2}>
                      <Grid
                        item
                        xs={12}
                        md={5}
                        sx={{
                          width: { xs: "250px", md: "200px" },
                          height: { xs: "250px", md: "200px" },
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
                            booking?.roomBookings[0]?.room?.roomType?.hotel
                              ?.name || "Hotel Image"
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
                      <Grid item xs={12} md={7}>
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

                          <Box my={3}>
                            <Grid container spacing={2} display={"flex"}>
                              <Grid item xs={12} md={4}>
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
                                    &nbsp;{" "}
                                    {formatDateLocaleVi(booking?.check_in)}
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
                                    &nbsp;{" "}
                                    {formatDateLocaleVi(booking?.check_out)}
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

              <Box
                sx={{
                  width: "calc(100% + 32px)",
                  mr: "12px",
                  ml: "24px",
                  height: "2px",
                  bgcolor: "neutral.200",
                }}
              />

              <Grid item xs={12}>
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

              <Box
                sx={{
                  width: "calc(100% + 32px)",
                  mr: "12px",
                  ml: "24px",
                  height: "2px",
                  bgcolor: "neutral.200",
                }}
              />

              <Grid item xs={12}>
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

              <Box
                sx={{
                  width: "calc(100% + 32px)",
                  mr: "12px",
                  ml: "24px",
                  height: "2px",
                  bgcolor: "neutral.200",
                }}
              />

              <Grid item xs={12}>
                {(() => {
                  const checkIn = dayjs(booking.check_in).format("YYYY-MM-DD");
                  const checkOut = dayjs(booking.check_out).format(
                    "YYYY-MM-DD"
                  );

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
                              <IconButton
                                onClick={handleToggle}
                                sx={{ color: "primary.main" }}
                              >
                                {expanded ? (
                                  <ExpandLessIcon />
                                ) : (
                                  <ExpandMoreIcon />
                                )}
                              </IconButton>
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
                      {expanded && (
                        <>
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
                                {booking?.roomBookings?.length} phòng x{" "}
                                {numNights} đêm
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
                        </>
                      )}
                    </Box>
                  );
                })()}
              </Grid>

              <Box
                sx={{
                  width: "calc(100% + 32px)",
                  mr: "12px",
                  ml: "24px",
                  height: "2px",
                  bgcolor: "neutral.200",
                }}
              />

              <Grid item xs={12}>
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
                      {payment.paymentMethod.code ===
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
                      label={payment?.translateStatus}
                      color={getPaymentStatusColor(payment?.status)}
                      sx={{
                        width: "auto",
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <NoBookings />
        )}
      </Box>

      <Box
        sx={{
          my: 2,
          mx: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href={"/"}>
          <Button variant="contained" color="primary">
            Quay lại trang chủ
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
