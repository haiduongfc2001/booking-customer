"use client";
import {
  Box,
  Button,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Icon,
  SvgIcon,
  Typography,
} from "@mui/material";
import * as React from "react";
import { getRequest, postRequest } from "@/services/api-instance";
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
  getRefundStatusColor,
} from "@/utils/get-status-color";
import { formatDateTime, formatDateLocaleVi } from "@/utils/format-date";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { renderBeds } from "@/utils/render-beds";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import formatCurrency from "@/utils/format-currency";
import { ZaloPayIcon } from "@/constant/icons";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomizedTooltip from "@/lib/tooltip";
import InfoIcon from "@mui/icons-material/Info";

interface Booking {
  [key: string]: any;
}

interface Refund {
  [key: string]: any;
}

const calculateDaysDifference = (checkInDate: string) => {
  const now = new Date();
  const checkIn = new Date(checkInDate);
  const diffTime = Math.abs(checkIn.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getRefundPercentage = (daysDifference: number) => {
  if (daysDifference >= 5) {
    return 100;
  } else if (daysDifference >= 3) {
    return 50;
  } else {
    return 0;
  }
};

const CancelBookingDialogContent = ({
  refundPercentage,
  finalPrice,
}: {
  refundPercentage: number;
  finalPrice: number;
}) => {
  let refundMessage = "";
  if (refundPercentage === 0) {
    refundMessage =
      "Bạn có chắc muốn hủy đơn đặt phòng này không? Nếu bạn hủy, bạn sẽ không được hoàn tiền.";
  } else {
    const refundAmount = (finalPrice * refundPercentage) / 100;
    refundMessage = `Bạn có chắc muốn hủy đơn đặt phòng này không? Nếu bạn hủy, bạn sẽ được hoàn <strong style="color: #6366f2">${refundPercentage}%</strong>. Số tiền được hoàn là <strong style="color: #6366f2">${formatCurrency(
      refundAmount
    )}</strong>.`;
  }

  return (
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        <span dangerouslySetInnerHTML={{ __html: refundMessage }} />
      </DialogContentText>
    </DialogContent>
  );
};

export default function BookingDetails(props: any) {
  const [booking, setBooking] = React.useState<Booking>({});
  const [openModalCancelBooking, setOpenModalCancelBooking] =
    React.useState<boolean>(false);
  const [cancelledBooking, setCancelledBooking] =
    React.useState<boolean>(false);
  const [refund, setRefund] = React.useState<Refund>({});
  const [bookingStatus, setBookingStatus] = React.useState<{
    [key: string]: any;
  }>({
    status: "",
    translateStatus: "",
  });

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

  const handleOpenModalCancelBooking = () => {
    setOpenModalCancelBooking(true);
  };

  const handleCloseModalCancelBooking = () => {
    setOpenModalCancelBooking(false);
  };

  const daysDifference = booking.check_in
    ? calculateDaysDifference(booking.check_in)
    : 0;
  const refundPercentage = getRefundPercentage(daysDifference);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleCancelBooking = async (payment_id: number) => {
    setOpenModalCancelBooking(false);
    try {
      const amount: number = Number(
        (booking.totalPrice * refundPercentage) / 100
      );

      // Send refund request
      await postRequest("/payment/zalopay/zaloPayRefund", {
        booking_id,
        amount,
        description: `Refund ${refundPercentage}% for booking id ${booking_id}`,
      });

      alert("Hủy phòng thành công");

      // Check if amount is 0 or less
      if (amount <= 0) {
        setBookingStatus({
          status: BOOKING_STATUS.CANCELLED,
          translateStatus: "Đã hủy",
        });
        return;
      }

      // Fetch initial booking details
      const response = await getRequest(
        `/payment/zalopay/zaloPayRefundStatus/${payment_id}`
      );

      // Update state based on initial response
      if (response && response.status === STATUS_CODE.OK) {
        setCancelledBooking(true);
        setRefund(response.data);
        setBookingStatus({
          status: BOOKING_STATUS.CANCELLED,
          translateStatus: "Đã hủy",
        });

        // Handle return_code
        const { return_code } = response.details;
        if (return_code === 1) {
          // Clear any existing interval if the condition is met
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else if (return_code === 2) {
          alert("Hủy phòng thất bại");
        } else if (return_code === 3) {
          // Set up the interval to fetch data every 2000 milliseconds
          intervalRef.current = setInterval(async () => {
            try {
              const intervalResponse = await getRequest(
                `/payment/zalopay/zaloPayRefundStatus/${payment_id}`
              );

              if (
                intervalResponse &&
                intervalResponse.status === STATUS_CODE.OK
              ) {
                setRefund(intervalResponse.data);
                if (intervalResponse.details.return_code === 1) {
                  window.location.reload();
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                  }
                }
              }
            } catch (error: any) {
              console.error(error.response?.data?.message || error.message);
            }
          }, 2000);
        }
      }

      // Clean up interval on component unmount
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    } finally {
      setOpenModalCancelBooking(false);
      window.location.reload();
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        py: 2,
        px: 4,
        my: 3,
        width: "70%",
        mx: "auto",
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
              <Grid item xs={12} md={4} p={1}>
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
              <Grid item xs={12} md={4} p={1}>
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
              <Grid item xs={12} md={4} p={1}>
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
                      display: "flex",
                      justifyContent: "center",
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
                        width: { xs: "150px", md: "200px" },
                        height: { xs: "150px", md: "200px" },
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={9}>
                    <Box display="flex" flexDirection="column" ml={2}>
                      <Typography variant="h6">{hotelName}</Typography>
                      <Typography variant="body2">{hotelAddress}</Typography>

                      <Box my={3}>
                        <Grid container spacing={2}>
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
            <Grid item xs={12} md={3}></Grid>
            <Grid item xs={12} md={9}>
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
                          <Typography
                            component="span"
                            sx={{
                              display: "inline-block",
                              overflow: "hidden",
                              maxWidth: "400px",
                              textOverflow: "ellipsis",
                              fontWeight: 600,
                              lineHeight: "17px",
                              pb: 1,
                            }}
                          >
                            {booking?.roomBookings.length}x&nbsp;
                            {booking?.roomBookings[0]?.room?.roomType?.name}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <PeopleAltIcon fontSize="small" />
                            <Typography
                              component="span"
                              sx={{
                                fontSize: "12px",
                                pl: 0.5,
                              }}
                            >
                              {booking?.totalAdults} người lớn
                              {booking?.totalChildren > 0 &&
                                `, ${booking.totalChildren} trẻ em`}
                            </Typography>
                          </Box>
                          {beds?.length > 0 && (
                            <Box display="flex" alignItems="center" my={1}>
                              <SvgIcon>
                                <SingleBedIcon />
                              </SvgIcon>
                              <Typography
                                component="span"
                                sx={{
                                  pl: 0.5,
                                }}
                              >
                                {renderBeds({ beds })}
                              </Typography>
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
            <Grid item xs={12} md={3}></Grid>
            <Grid item xs={12} md={9}>
              {(() => {
                const customer = booking?.customer;

                return (
                  <Box display="flex" flexDirection="column" p={2} mb={2}>
                    <Typography
                      component="span"
                      sx={{
                        display: "inline-block",
                        overflow: "hidden",
                        maxWidth: "400px",
                        textOverflow: "ellipsis",
                        fontWeight: 600,
                        lineHeight: "17px",
                        pb: 1,
                      }}
                    >
                      Thông tin liên hệ
                    </Typography>
                    <Box display="flex" alignItems="center" pt={1}>
                      <PeopleAltIcon fontSize="small" />
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "12px",
                          pl: 1,
                        }}
                      >
                        {customer?.full_name}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" pt={1}>
                      <AlternateEmailIcon fontSize="small" />
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "12px",
                          pl: 1,
                        }}
                      >
                        {customer?.email}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" pt={1}>
                      <PhoneAndroidIcon fontSize="small" />
                      <Typography
                        component="span"
                        sx={{
                          fontSize: "12px",
                          pl: 1,
                        }}
                      >
                        {customer?.phone}
                      </Typography>
                    </Box>
                  </Box>
                );
              })()}
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={12} md={3}></Grid>
            <Grid item xs={12} md={9}>
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
                      mb={1}
                    >
                      <Box>
                        <Typography variant="h6">Tổng tiền</Typography>
                        <Typography variant="body2">
                          Đã bao gồm thuế, phí, VAT
                        </Typography>
                      </Box>
                      <Typography variant="h6">
                        {formatCurrency(booking.totalPrice)}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      mb={1}
                    >
                      <Typography variant="body1">
                        {booking?.roomBookings?.length} phòng x {numNights} đêm
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(booking.total_room_price)}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="body1">
                        Thuế và phí dịch vụ của khách sạn
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(booking.tax_and_fee)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })()}
            </Grid>
          </Grid>

          {booking?.payment && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}></Grid>
              <Grid item xs={12} md={9}>
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
                      {booking?.payment?.paymentMethod?.code ===
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

          {booking?.payment?.refund && (
            <Box
              sx={{
                width: "calc(100% + 32px)",
                mr: "0px",
                ml: "12px",
                height: "2px",
                bgcolor: "neutral.200",
              }}
            />
          )}

          {booking?.status === BOOKING_STATUS.CONFIRMED &&
            booking?.payment?.status === PAYMENT_STATUS.COMPLETED && (
              <Grid container spacing={2}>
                {bookingStatus.status !== BOOKING_STATUS.CANCELLED ? (
                  <>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={handleOpenModalCancelBooking}
                        >
                          Hủy đặt phòng
                        </Button>

                        <Dialog
                          open={openModalCancelBooking}
                          onClose={handleCloseModalCancelBooking}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                          sx={{
                            "& .MuiPaper-root": {
                              p: 2,
                            },
                          }}
                        >
                          <DialogTitle id="alert-dialog-title">
                            Hủy đặt phòng
                          </DialogTitle>
                          <CancelBookingDialogContent
                            refundPercentage={refundPercentage}
                            finalPrice={booking.totalPrice}
                          />
                          <DialogActions>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() =>
                                handleCancelBooking(booking?.payment.id)
                              }
                            >
                              Đồng ý hủy
                            </Button>
                            <Button
                              autoFocus
                              variant="contained"
                              color="inherit"
                              onClick={handleCloseModalCancelBooking}
                            >
                              Hủy
                            </Button>
                          </DialogActions>
                        </Dialog>

                        <CustomizedTooltip
                          title={
                            <ul style={{ paddingLeft: 10 }}>
                              <li>
                                Quý khách sẽ được hoàn tiền 100% nếu hủy đặt
                                phòng trước 5 ngày so với ngày nhận phòng.
                              </li>
                              <li>
                                Quý khách sẽ được hoàn tiền 50% nếu hủy đặt
                                phòng trước 3 ngày so với ngày nhận phòng.
                              </li>
                              <li>
                                Các trường hợp hủy sau thời hạn trên sẽ không
                                được hoàn tiền.
                              </li>
                            </ul>
                          }
                          content={
                            <Box
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              mt={2}
                              sx={{ cursor: "pointer" }}
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: "primary.main",
                                  ml: 0.5,
                                }}
                              >
                                Chính sách hủy và hoàn tiền&nbsp;
                              </Typography>
                              <Icon>
                                <InfoIcon />
                              </Icon>
                            </Box>
                          }
                        />
                      </Box>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} md={3}></Grid>
                    <Grid item xs={12} md={9}>
                      <Box p={2} mb={2}>
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <Typography variant="subtitle1">
                            Trạng thái hoàn tiền
                          </Typography>
                          <Chip
                            label={
                              refund?.return_message ||
                              booking?.payment?.refund.translateStatus
                            }
                            color={getRefundStatusColor(
                              refund?.return_code ||
                                booking?.payment?.refund?.status
                            )}
                            sx={{
                              width: "auto",
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            )}

          {(cancelledBooking || booking?.payment?.refund) && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}></Grid>
              <Grid item xs={12} md={9}>
                <Box p={2} mb={2}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={2}
                  >
                    <Typography variant="subtitle1">
                      Trạng thái hoàn tiền
                    </Typography>
                    <Chip
                      label={
                        refund?.return_message ||
                        booking?.payment?.refund.translateStatus
                      }
                      color={getRefundStatusColor(
                        refund?.return_code || booking?.payment?.refund?.status
                      )}
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
        </Grid>
      ) : (
        <NoBookings />
      )}
    </Box>
  );
}
