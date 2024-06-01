"use client";
import { FC } from "react";
import * as React from "react";
import { Box, Button, CardMedia, Chip, Grid, Typography } from "@mui/material";
import { myBookings } from "@/utils/data";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import calculateNumberOfNights from "@/utils/calculate-number-of-nights";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import NoBookings from "./no-bookings";

interface MyBookingsProps {}

interface RoomBooking {
  name: string;
  numAdult: number;
  numChildren: number;
  freeBreakfast: boolean;
  freeCancellation: boolean;
  refundable: boolean;
  quantity: number;
  childrenAges: number[];
  bedTypes: string[];
  hotelCancellationPolicies: {
    dateFrom: string | null;
    dateTo: string | null;
    refundAmount: number;
    price: number;
    percent: number;
    cancellationType: string;
  }[];
  noSmoking: boolean;
  isHighFloor: boolean;
  specialRequest: string | null;
  contactName: string;
  phoneNumber: string;
  contactEmail: string;
  totalBasePrice: number;
  totalTaxAndFee: number;
  totalSurcharge: number;
  totalSystemFee: number;
  totalDiscount: number;
  checkInHour: string;
  checkOutHour: string | null;
  partnerRoomBookingCode: string;
  nightlyPrices: any[] | null;
}

type RoomBookingList = RoomBooking[];

const MyBookings: FC<MyBookingsProps> = () => {
  const formattedCheckInDate = dayjs().format("YYYY-MM-DD");
  const formattedCheckOutDate = dayjs().add(1).format("YYYY-MM-DD");

  const getCityFromAddress = (address: string): string => {
    const addressArray = address?.split(",");
    // Tách thành phố/tỉnh từ địa chỉ
    const city = addressArray[addressArray?.length - 1]?.trim();

    return city || "Hà Nội";
  };

  const formatDate = (date: string): string => {
    const parsedDate = dayjs(date, "DD-MM-YYYY");
    const formattedDate = parsedDate.locale("vi").format("dddd, DD [tháng] M");

    // Chuyển chữ cái đầu thành chữ cái viết hoa
    const formattedDateCapitalized = formattedDate.replace(
      formattedDate.charAt(0),
      formattedDate.charAt(0).toUpperCase()
    );

    return formattedDateCapitalized;
  };

  return (
    <Box sx={{ flex: "1" }}>
      {myBookings.length > 0 ? (
        <Grid container spacing={3}>
          {myBookings?.map((booking, index) => (
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
                    &nbsp;{booking?.orderCode}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button>
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
                      <CardMedia
                        component="img"
                        src={
                          booking?.hotel?.thumbnail?.src ||
                          "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                        }
                        alt={booking?.hotel?.name}
                        sx={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
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
                              {(() => {
                                const searchQueryParams = new URLSearchParams({
                                  location: getCityFromAddress(
                                    booking?.hotel?.address?.address
                                  ),
                                  checkIn: formattedCheckInDate,
                                  checkOut: formattedCheckOutDate,
                                  numAdults: "1",
                                  numRooms: "1",
                                }).toString();

                                return (
                                  <Link
                                    href={`/hotel/${booking?.hotel?.id}?${searchQueryParams}`}
                                  >
                                    {booking?.hotel?.name}
                                  </Link>
                                );
                              })()}
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
                              {booking?.numRooms}x&nbsp;
                              {booking?.roomBookings[0]?.name}
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
                                {booking?.numAdult + booking?.numChildren}
                                &nbsp;người
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
                              {formatDate(booking?.checkIn)}
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
                                  dayjs(booking?.checkIn, "DD-MM-YYYY").format(
                                    "YYYY-DD-MM"
                                  ),
                                  dayjs(booking?.checkOut, "DD-MM-YYYY").format(
                                    "YYYY-DD-MM"
                                  )
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
                              {formatDate(booking?.checkOut)}
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
                            <span>{booking?.hotel?.checkInTime}</span>
                            <span>{booking?.hotel?.checkOutTime}</span>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Box
                            sx={{
                              display: "flex",
                              textAlign: "end",
                              alignItems: "flex-end",
                              pl: "96px",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              minHeight: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
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
                                {booking?.finalPriceFormatted}
                              </span>
                            </Box>
                            <Box
                              width="100%"
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-end",
                              }}
                            >
                              <Chip
                                label={booking?.bookingStatus}
                                color="primary"
                                sx={{
                                  width: "100%",
                                }}
                              />
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      ) : (
        <NoBookings />
      )}
    </Box>
  );
};

export default MyBookings;
