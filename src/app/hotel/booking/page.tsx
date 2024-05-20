"use client";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  SvgIcon,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import * as React from "react";
import Image from "next/image";
import { booking, roomInfo } from "@/utils/data";
import {
  BankTransferIcon,
  BreakfastIcon,
  ConfirmIcon,
  MomoIcon,
  SingleBedIcon,
  ZaloPayIcon,
} from "@/constant/icons";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import QrCodeOutlinedIcon from "@mui/icons-material/QrCodeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import calculateNumberOfNights from "@/utils/calculate-number-of-nights";
import RoomPricing from "@/components/booking/room-pricing";
import RoomInfo from "@/components/booking/room-info";
import BookingDetails from "@/components/booking/booking-details";

const addSpecialRequestList: string[] = [
  "Phòng không hút thuốc",
  "Phòng ở tầng cao",
];

const paymentMethodsList: any[] = [
  {
    name: "Chuyển khoản (Việt QR miễn phí)",
    icon: <BankTransferIcon />,
    code: "VIETQR",
  },
  {
    name: "Vnpay QR",
    icon: <QrCodeOutlinedIcon />,
    code: "VNPAYQR",
  },
  {
    name: "ATM/Internet Banking",
    icon: <CreditCardOutlinedIcon />,
    code: "ATM/INTERNET_BANKING",
  },
  {
    name: "ZaloPay",
    icon: <ZaloPayIcon />,
    code: "ZALOPAY",
  },
  {
    name: "Momo",
    icon: <MomoIcon />,
    code: "MOMO",
  },
];

export default function HotelDetail(props: any) {
  const {
    roomId,
    checkInDate,
    checkOutDate,
    numAdults,
    numChildren,
    numRooms,
    hotelId,
  } = props.searchParams;

  const [isAddingSpecialRequest, setIsAddingSpecialRequest] =
    React.useState(false);
  const [selectedCheckInTime, setSelectedCheckInTime] = React.useState("6:00 - 7:00");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("");

  const handleChangeCheckInTime = (event: SelectChangeEvent<string>) => {
    setSelectedCheckInTime(event.target.value as string);
  };

  const handleChangePaymentMethod = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentMethod(event.target.value as string);
  };

  const numberOfNights = calculateNumberOfNights(checkInDate, checkOutDate);

  return (
    <div>
      <Box mx={10} my={4}>
        <CustomizedBreadcrumbs
          newBreadcrumbsData={[
            {
              label: "Khách sạn",
              icon: <HotelIcon />,
            },
            {
              label: "Đặt phòng",
              icon: <BorderColorOutlinedIcon />,
            },
          ]}
        />

        <Grid container spacing={3} my={3}>
          <Grid item xs={12} md={7}>
            <BookingDetails booking={booking} numberOfNights={numberOfNights} />

            <Box sx={{ bgcolor: "neutral.200", p: 2, mb: 2, borderRadius: 1 }}>
              <Typography variant="h6">Thông tin liên hệ</Typography>
              <Grid container spacing={2} my={1}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="full_name"
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    size="small"
                    sx={{
                      "& .MuiInputBase-input": {
                        bgcolor: "background.paper",
                      },
                    }}
                    // onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    size="small"
                    sx={{
                      "& .MuiInputBase-input": {
                        bgcolor: "background.paper",
                      },
                    }}
                    // onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    type="text"
                    placeholder="Nhập số điện thoại của bạn"
                    size="small"
                    sx={{
                      "& .MuiInputBase-input": {
                        bgcolor: "background.paper",
                      },
                    }}
                    // onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ bgcolor: "neutral.200", p: 2, mb: 2, borderRadius: 1 }}>
              <Typography variant="h6">Yêu cầu đặc biệt</Typography>
              <Box
                sx={{
                  color: "warning.main",
                  p: "8px 12px",
                  borderRadius: 1,
                  mt: 1,
                  mb: 3,
                  bgcolor: "rgba(237, 137, 54, 0.1)",
                }}
              >
                Lưu ý: Các yêu cầu của bạn chỉ được đáp ứng tuỳ tình trạng phòng
                của khách sạn.
              </Box>

              <Typography variant="subtitle1">Các loại giường</Typography>
              {booking?.roomBookings?.length > 0 &&
                booking?.roomBookings.map((roomBooking, index) => (
                  <Box
                    key={index}
                    sx={{
                      my: 1,
                      p: 1,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "neutral.900",
                    }}
                  >
                    <Typography variant="subtitle2">
                      Phòng {index + 1}: {roomBooking.name}
                    </Typography>
                    <Box
                      display="flex"
                      width="50%"
                      alignItems="center"
                      pr="2px"
                      mt={1}
                    >
                      {Array.from({ length: roomBooking?.numBeds }).map(
                        (_, index) => (
                          <SingleBedIcon key={index} />
                        )
                      )}
                      <Typography variant="body1" sx={{ ml: 1 }}>
                        {roomBooking?.bedTypes}
                      </Typography>
                    </Box>
                  </Box>
                ))}

              <Box mt={2}>
                <Box display="flex" alignItems="center">
                  <Typography variant="subtitle1">
                    Thời gian nhận phòng dự kiến (không bắt buộc)
                  </Typography>
                </Box>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <Select
                      value={selectedCheckInTime}
                      id="select-check-in-time"
                      sx={{ bgcolor: "background.paper" }}
                      label="Thời gian nhận phòng"
                      onChange={handleChangeCheckInTime}
                    >
                      <MenuItem value={"10"}>6:00 - 7:00</MenuItem>
                      <MenuItem value={"20"}>7:00 - 8:00</MenuItem>
                      <MenuItem value={"30"}>8:00 - 9:00</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <Box bgcolor="primary.light" mt={2} p={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1">
                    Yêu cầu đặc biệt khác
                  </Typography>
                  <IconButton
                    onClick={() =>
                      setIsAddingSpecialRequest(!isAddingSpecialRequest)
                    }
                  >
                    {isAddingSpecialRequest ? (
                      <RemoveCircleOutlinedIcon color="primary" />
                    ) : (
                      <AddCircleOutlinedIcon color="primary" />
                    )}
                  </IconButton>
                </Box>

                {isAddingSpecialRequest && (
                  <Box>
                    <FormGroup>
                      {addSpecialRequestList.map((specialRequest) => (
                        <FormControlLabel
                          key={specialRequest}
                          control={<Checkbox />}
                          label={specialRequest}
                          sx={{
                            "&:hover": {
                              ".MuiTypography-root, .MuiButtonBase-root": {
                                color: (theme) => theme.palette.primary.main,
                                transition: "color 0.2s ease",
                              },
                            },
                          }}
                        />
                      ))}
                    </FormGroup>

                    <Box mt={1}>
                      <Typography variant="subtitle1">
                        Yêu cầu riêng của bạn
                      </Typography>
                      <TextField
                        multiline
                        fullWidth
                        type="text"
                        placeholder="Nhập yêu cầu khác"
                        minRows={3}
                        maxRows={5}
                        sx={{ bgcolor: "background.paper", borderRadius: 1 }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            <Box sx={{ bgcolor: "neutral.200", p: 2, mb: 2, borderRadius: 1 }}>
              <Typography variant="h6">Phương thức thanh toán</Typography>
              <Typography variant="subtitle1" color="success.main">
                Sau khi hoàn tất thanh toán, mã xác nhận phòng sẽ được gửi ngay
                qua Email của bạn.
              </Typography>
              <Box mt={2}>
                <RadioGroup
                  aria-labelledby="demo-customized-radios"
                  name="customized-radios"
                  value={selectedPaymentMethod}
                  onChange={handleChangePaymentMethod}
                >
                  {paymentMethodsList.length > 0 &&
                    paymentMethodsList.map((paymentMethod) => (
                      <Box
                        key={paymentMethod.code}
                        sx={{
                          p: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid",
                          "&:hover": {
                            bgcolor: "neutral.50",
                            cursor: "pointer",
                            borderRadius: 1,
                            border: "none",
                          },
                        }}
                        onClick={() =>
                          setSelectedPaymentMethod(paymentMethod.code)
                        }
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Icon sx={{ mr: 2 }}>{paymentMethod.icon}</Icon>
                          {paymentMethod.name}
                        </Box>
                        <FormControlLabel
                          labelPlacement="start"
                          value={paymentMethod.code}
                          control={<Radio />}
                          label=""
                          sx={{ marginLeft: 0 }}
                        />
                      </Box>
                    ))}
                </RadioGroup>
              </Box>

              <Box
                mt={2}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Button variant="contained" color="primary">
                  Đặt phòng
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <RoomInfo roomInfo={roomInfo} booking={booking} />

            <RoomPricing
              numberOfNights={numberOfNights}
              booking={booking}
              roomInfo={roomInfo}
            />
          </Grid>
        </Grid>
      </Box>

      {/* <List>
        <ListItem>roomId : {roomId}</ListItem>
        <ListItem>checkInDate : {checkInDate}</ListItem>
        <ListItem>checkOutDate : {checkOutDate}</ListItem>
        <ListItem>numAdults : {numAdults}</ListItem>
        <ListItem>numChildren : {numChildren}</ListItem>
        <ListItem>numRooms : {numRooms}</ListItem>
        <ListItem>hotelId : {hotelId}</ListItem>
      </List> */}
    </div>
  );
}
