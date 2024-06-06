"use client";
import { FC } from "react";
import * as React from "react";
import { Box, Button, CardMedia, Chip, Grid, Typography } from "@mui/material";
import Link from "next/link";
import dayjs from "dayjs";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import calculateNumberOfNights from "@/utils/calculate-number-of-nights";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import NoBookings from "./no-bookings";
import { getRequest } from "@/services/api-instance";
import { FALLBACK_URL, STATUS_CODE } from "@/constant/constants";
import formatCurrency from "@/utils/format-currency";
import { getBookingStatusColor } from "@/utils/get-status-color";
import { useRouter } from "next/navigation";
import { formatDateLocaleVi } from "@/utils/format-date";

interface MyBookingsProps {}

interface RoomBooking {
  [key: string]: any;
}

type RoomBookingList = RoomBooking[];

const MyBookings: FC<MyBookingsProps> = () => {
  const router = useRouter();

  const customer_id = 525;

  const initialLoad = React.useRef(true);
  const [myBookings, setMyBookingsData] = React.useState<RoomBookingList>([]);

  const fetchBookings = async () => {
    try {
      const response = await getRequest(
        `/booking/getAllBookingsByCustomerId/${customer_id}`
      );

      if (response && response.status === STATUS_CODE.OK) {
        setMyBookingsData(response.data);
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
    fetchBookings();
  }, []);

  return (
    <Box sx={{ flex: "1" }}>
      {myBookings?.length > 0 ? (
        <Grid container spacing={3}>
          {myBookings?.map(
            (
              booking: {
                [key: string]: any;
              },
              index: number
            ) => (
              <React.Fragment key={booking?.id}>
                <Grid
                  item
                  xs={12}
                  sx={{
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pt: "8px !important",
                    mt: index === 0 ? 1 : "40px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      lineHeight: "17px",
                    }}
                  >
                    <Typography sx={{ color: "neutral.900" }}>
                      Mã đơn hàng:
                    </Typography>
                    <Typography sx={{ p: "2px", fontWeight: 500 }}>
                      &nbsp;{booking?.code}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Button
                      onClick={() =>
                        router.push(`/account/my-booking/${booking?.id}`)
                      }
                    >
                      <Box component="span" pr={0.5}>
                        Xem chi tiết
                      </Box>
                      <ChevronRightIcon fontSize="small" />
                    </Button>
                  </Box>
                </Grid>
                <Box
                  sx={{
                    width: "calc(100% + 32px)",
                    margin: "12px 12px 12px 24px",
                    height: "1px",
                    bgcolor: "neutral.200",
                  }}
                />
                <Grid
                  item
                  xs={12}
                  key={booking?.id}
                  sx={{ pt: "8px !important" }}
                >
                  <Link href={`/account/my-booking/${booking?.id}`}>
                    <Box
                      sx={{
                        color: "neutral.900",
                        width: "100%",
                        border: "2px solid #EDF2F7",
                        display: "flex",
                        p: 2,
                        fontSize: "14px",
                        bgcolor: "neutral.100",
                        boxShadow: "0px 1px 1px rgba(0, 0, 0, 0.05)",
                        transition: "all 0.2s",
                        fontWeight: "normal",
                        lineHeight: "17px",
                        borderRadius: 1,
                        "&:hover": {
                          bgcolor: "primary.light",
                          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                          cursor: "pointer",
                        },
                        "&:hover .MuiTypography-h6": {
                          color: "primary.main",
                          transition: "all .2s",
                          cursor: "pointer",
                        },
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          {(() => {
                            const hotelImages =
                              booking?.roomBookings[0]?.room?.roomType?.hotel
                                ?.hotelImages || [];

                            const primaryImageUrl = hotelImages
                              .filter(
                                (hotelImage: any) =>
                                  hotelImage.is_primary === true
                              )
                              .map((hotelImage: any) => hotelImage.url)
                              .find((url: string) => url);

                            const fallbackUrl = FALLBACK_URL.HOTEL_NO_IMAGE;

                            const hotelAvatar = primaryImageUrl || fallbackUrl;

                            return (
                              <CardMedia
                                component="img"
                                src={hotelAvatar}
                                alt={
                                  booking?.roomBookings[0]?.room?.roomType
                                    ?.hotel?.name || "Hotel Image"
                                }
                                sx={{
                                  width: "100%",
                                  height: "200px",
                                  objectFit: "cover",
                                  borderRadius: 1,
                                }}
                              />
                            );
                          })()}
                        </Grid>

                        <Grid item xs={12} md={9}>
                          <Grid container spacing={2} sx={{ height: "100%" }}>
                            <Grid item xs={12} md={4}>
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
                                  {
                                    booking?.roomBookings[0]?.room?.roomType
                                      ?.hotel?.name
                                  }
                                </Typography>

                                <Box
                                  component="span"
                                  sx={{
                                    display: "inline-block",
                                    overflow: "hidden !important",
                                    maxWidth: "400px",
                                    textOverflow: "ellipsis",

                                    fontWeight: 600,
                                    lineHeight: "17px",
                                    pt: 1,
                                    pb: 1,
                                  }}
                                >
                                  {booking?.roomBookings.length}x&nbsp;
                                  {
                                    booking?.roomBookings[0]?.room?.roomType
                                      ?.name
                                  }
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
                                      `, ${booking?.totalChildren} trẻ em`}
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Box
                                sx={{
                                  color: "neutral",
                                  display: "flex",
                                  lineHeight: "17px",
                                  justifyContent: "space-between",
                                  mb: 1,
                                }}
                              >
                                <span>Nhận phòng</span>
                                <span>Trả phòng</span>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  pt: "2px",
                                  pb: "2px",
                                  justifyContent: "space-between",
                                  mb: 1,
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    lineHeight: "17px",
                                  }}
                                >
                                  {formatDateLocaleVi(booking?.check_in)}
                                </Typography>
                                <Box
                                  sx={{
                                    width: 54,
                                    height: 46,
                                    margin: "0 24px",
                                    display: "flex",
                                    alignItems: "center",
                                    borderRadius: "100px",
                                    justifyContent: "center",
                                    bgcolor: "background.paper",
                                    border: "1px solid",
                                    borderColor: "primary.main",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      fontSize: "11px",
                                      lineHeight: "13px",
                                      pr: "2px",
                                      pl: 0.5,
                                    }}
                                  >
                                    {calculateNumberOfNights(
                                      booking?.check_in,
                                      booking?.check_out
                                    )}
                                  </Box>

                                  <ModeNightIcon
                                    fontSize="small"
                                    sx={{
                                      fill: "#ffffff",
                                      stroke: "#000000",
                                      pr: 0.5,
                                    }}
                                  />
                                </Box>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    lineHeight: "17px",
                                  }}
                                >
                                  {formatDateLocaleVi(booking?.check_out)}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  color: "neutral.500",
                                  display: "flex",
                                  lineHeight: "17px",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span>
                                  {dayjs(booking?.check_in).format("HH:mm")}
                                </span>
                                <span>
                                  {dayjs(booking?.check_out).format("HH:mm")}
                                </span>
                              </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Box
                                sx={{
                                  display: "flex",
                                  textAlign: "end",
                                  alignItems: "flex-end",
                                  pl: { xs: 0, md: "96px" },
                                  mt: { xs: 2, md: 0 },
                                  flexDirection: "column",
                                  justifyContent: "space-between",
                                  minHeight: "100%",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    mt: { xs: 2, md: 0 },
                                  }}
                                >
                                  <span style={{ lineHeight: "17px" }}>
                                    Tổng tiền
                                  </span>
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      lineHeight: "19px",
                                      paddingTop: "4px",
                                    }}
                                  >
                                    {formatCurrency(booking?.totalPrice)}
                                  </span>
                                </Box>
                                <Box
                                  sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: { xs: 2, md: 0 },
                                  }}
                                >
                                  <Chip
                                    label={booking?.translateStatus}
                                    color={getBookingStatusColor(
                                      booking?.status
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
                        </Grid>
                      </Grid>
                    </Box>
                  </Link>
                </Grid>
              </React.Fragment>
            )
          )}
        </Grid>
      ) : (
        <NoBookings />
      )}
    </Box>
  );
};

export default MyBookings;
