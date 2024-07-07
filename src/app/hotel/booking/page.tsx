"use client";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import * as React from "react";
import { SingleBedIcon } from "@/constant/icons";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import calculateNumberOfNights from "@/utils/calculate-number-of-nights";
import RoomPricing from "@/components/booking/room-pricing";
import RoomInfo from "@/components/booking/room-info";
import BookingDetails from "@/components/booking/booking-details";
import { paymentMethodsList } from "@/components/booking/payment-methods-list";
import { getRequest, patchRequest, postRequest } from "@/services/api-instance";
import {
  ALERT_TYPE,
  API,
  PAYMENT_METHODS,
  STATUS_CODE,
} from "@/constant/constants";
import { CountdownTimer } from "@/components/booking/countdown-timer";
import { renderBeds } from "@/utils/render-beds";
import { useFormik } from "formik";
import * as Yup from "yup";
import { openAlert } from "@/redux/slices/alert-slice";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import { AppDispatch, RootState } from "@/redux/store/store";
import { closeLoadingApi, openLoadingApi } from "@/redux/slices/loading-slice";

const addSpecialRequestList: string[] = [
  "Phòng không hút thuốc",
  "Phòng ở tầng cao",
];

export default function Booking(props: any) {
  const {
    roomTypeId,
    hotelId,
    checkIn,
    checkOut,
    numRooms,
    numAdults,
    numChildren,
    childrenAges,
  } = props.searchParams;

  const [isAddingSpecialRequest, setIsAddingSpecialRequest] =
    React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [bookingData, setBookingData] = React.useState<any>({});
  const [hotelData, setHotelData] = React.useState<any>({});
  const [customerData, setCustomerData] = React.useState({
    email: "",
    full_name: "",
    phone: "",
  });
  const [bookingNote, setBookingNote] = React.useState<string>();

  const customer_id = useAppSelector(
    (state: RootState) => state.auth.customer_id
  );
  const dispatch: AppDispatch = useAppDispatch();

  // const initialLoad = React.useRef(true);

  const handleChangePaymentMethod = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentMethod(event.target.value as string);
  };

  const numNights = calculateNumberOfNights(checkIn, checkOut);

  const createBooking = async () => {
    const bookingBody = {
      customer_id,
      check_in: checkIn,
      check_out: checkOut,
      num_rooms: Number(numRooms),
      num_adults: Number(numAdults),
      num_children: Number(numChildren),
      children_ages: childrenAges ? childrenAges.split(",").map(Number) : [],
      hotel_id: Number(hotelId),
      room_type_id: Number(roomTypeId),
    };

    try {
      const response = await postRequest(
        API.BOOKING.CREATE_BOOKING,
        bookingBody
      );

      if (response?.status === STATUS_CODE.CREATED) {
        setBookingData(response.data);
        setHotelData(response.data?.hotel);
        setCustomerData(response.data?.customer);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
      setError(error.message);
    }
  };

  React.useEffect(() => {
    // if (initialLoad.current) {
    //   initialLoad.current = false;
    //   return;
    // }
    createBooking();
  }, [
    roomTypeId,
    hotelId,
    checkIn,
    checkOut,
    numRooms,
    numAdults,
    numChildren,
    childrenAges,
  ]);

  const theme = useTheme();
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const searchQueryParams = new URLSearchParams({
    location: bookingData?.hotel?.province,
    checkIn,
    checkOut,
    numAdults: String(numAdults),
    numRooms: String(numRooms),
  }).toString();

  const initialValues = React.useMemo(
    () => ({
      email: customerData?.email || "",
      full_name: customerData?.full_name || "",
      phone: customerData?.phone || "",
      submit: null,
    }),
    [customerData?.email, customerData?.full_name, customerData?.phone]
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      full_name: Yup.string().max(30).required("Vui lòng nhập họ và tên!"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại chỉ gồm 10 số!")
        .min(10, "Số điện thoại phải dài chính xác 10 ký tự!")
        .max(10, "Số điện thoại phải dài chính xác 10 ký tự!")
        .required("Vui lòng nhập số điện thoại của bạn!"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        dispatch(openLoadingApi());

        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("full_name", values.full_name);
        formData.append("phone", values.phone);

        const res = await patchRequest(
          `/customer/${customer_id}/updateCustomer`,
          formData
        );

        if (res?.status === STATUS_CODE.OK) {
          // handle success case
          helpers.setStatus({ success: true });
        } else {
          // handle error case
          dispatch(
            openAlert({
              type: ALERT_TYPE.ERROR,
              message: res.data.message || "Cập nhật thất bại",
            })
          );
          helpers.setErrors({
            submit: res.data.message || "Cập nhật thất bại",
          });
        }
      } catch (err: any) {
        dispatch(
          openAlert({
            type: ALERT_TYPE.ERROR,
            message:
              err.response?.data?.message || "Dữ liệu người dùng không hợp lệ",
          })
        );
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        dispatch(closeLoadingApi());
        helpers.setSubmitting(false);
      }
    },
  });

  const handleBooking = async () => {
    if (!selectedPaymentMethod) {
      dispatch(
        openAlert({
          type: ALERT_TYPE.WARNING,
          message: "Vui lòng chọn phương thức thanh toán!",
        })
      );
      return;
    }

    formik.handleSubmit();

    if (bookingNote) {
      await postRequest(`/booking/${bookingData.id}/updateBooking`, {
        note: bookingNote,
      });
    }

    const amount = bookingData?.cost?.final_price;
    const description = `Payment for booking at ${hotelData?.name} from ${checkIn} to ${checkOut}. 
      Room type: ${hotelData.roomTypes.name}, 
      Number of rooms: ${numRooms}, 
      Number of adults: ${numAdults}, 
      Number of children: ${numChildren}.
      Booking reference: #${bookingData?.code}`;

    if (selectedPaymentMethod === PAYMENT_METHODS.ZALOPAY) {
      const body = {
        booking_id: Number(bookingData.id),
        appUser: bookingData?.customer?.email,
        amount,
        bankCode: "",
        description,
      };

      try {
        const response = await postRequest(
          API.PAYMENT.CREATE_ZALOPAY_PAYMENT_URL,
          body
        );

        if (response?.return_code === 1) {
          window.location.href = response?.order_url;
        }
      } catch (error: any) {
        console.error(error.response?.data?.message || error.message);
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <CountdownTimer
        theme={theme}
        scrollY={scrollY}
        hotelId={Number(hotelId)}
        searchQueryParams={searchQueryParams}
        expiresAt={bookingData.expires_at}
      />

      <Box mx={10} my={6}>
        <CustomizedBreadcrumbs
          newBreadcrumbsData={[
            {
              label: `${bookingData?.hotel?.name}`,
              href: `/hotel/${hotelId}?${searchQueryParams}`,
              icon: <HotelIcon />,
            },
            {
              label: "Đặt phòng",
              icon: <BorderColorOutlinedIcon />,
            },
          ]}
        />

        {bookingData && (
          <Grid container spacing={3} my={3}>
            <Grid item xs={12} md={7}>
              <BookingDetails booking={bookingData} numNights={numNights} />

              {/* <form noValidate onSubmit={formik.handleSubmit}> */}
              <Box
                sx={{ bgcolor: "neutral.200", p: 2, mb: 2, borderRadius: 1 }}
                component="form"
                noValidate
                autoComplete="off"
              >
                <Typography variant="h6">Thông tin liên hệ</Typography>
                <Grid container spacing={2} my={1}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      // required
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
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.full_name}
                      error={
                        !!(formik.touched.full_name && formik.errors.full_name)
                      }
                      helperText={
                        formik.touched.full_name && formik.errors.full_name
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Email"
                      name="email"
                      type="text"
                      size="small"
                      sx={{
                        "& .MuiInputBase-input": {
                          bgcolor: "background.paper",
                        },
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      error={!!(formik.touched.email && formik.errors.email)}
                      // helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      // required
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
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.phone}
                      error={!!(formik.touched.phone && formik.errors.phone)}
                      helperText={formik.touched.phone && formik.errors.phone}
                    />
                  </Grid>
                </Grid>
              </Box>
              {formik.errors.submit && (
                <Typography color="error" sx={{ mt: 3 }} variant="body2">
                  {formik.errors.submit}
                </Typography>
              )}
              {/* </form> */}

              <Box
                sx={{ bgcolor: "neutral.200", p: 2, mb: 2, borderRadius: 1 }}
              >
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
                  Lưu ý: Các yêu cầu của bạn chỉ được đáp ứng tuỳ tình trạng
                  phòng của khách sạn.
                </Box>

                <Typography variant="subtitle1">Các loại giường</Typography>
                {bookingData?.room_bookings?.length > 0 &&
                  bookingData?.room_bookings.map(
                    (room_booking: { [key: string]: any }, index: number) => (
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
                          Phòng {index + 1}: {hotelData.roomTypes.name}
                        </Typography>
                        <Box
                          display="flex"
                          width="100%"
                          alignItems="center"
                          pr="2px"
                          mt={1}
                        >
                          <SingleBedIcon />
                          <>
                            {renderBeds({ beds: hotelData?.roomTypes?.beds })}
                          </>
                        </Box>
                      </Box>
                    )
                  )}

                {/* <Box bgcolor="primary.light" mt={2} p={2}>
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
                        <Typography variant="subtitle1" my={1}>
                          Yêu cầu riêng của bạn
                        </Typography>
                        <TextField
                          multiline
                          fullWidth
                          type="text"
                          placeholder="Nhập yêu cầu khác"
                          minRows={3}
                          maxRows={5}
                          sx={{
                            bgcolor: "background.paper",
                            borderRadius: 1,
                            "& .MuiInputBase-root.MuiFilledInput-root": {
                              p: "8px 12px",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Box> */}

                <Box mt={1}>
                  <Typography variant="subtitle1" my={1}>
                    Yêu cầu riêng của bạn
                  </Typography>
                  <TextField
                    multiline
                    fullWidth
                    type="text"
                    placeholder="Nhập yêu cầu khác"
                    minRows={3}
                    maxRows={5}
                    sx={{
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      "& .MuiInputBase-root.MuiFilledInput-root": {
                        p: "8px 12px",
                      },
                    }}
                    onChange={(e) => setBookingNote(e.target.value)}
                  />
                </Box>
              </Box>

              <Box
                sx={{ bgcolor: "neutral.200", p: 2, mb: 2, borderRadius: 1 }}
              >
                <Typography variant="h6">Phương thức thanh toán</Typography>
                <Typography variant="subtitle1" color="success.main">
                  Sau khi hoàn tất thanh toán, mã xác nhận phòng sẽ được gửi
                  ngay qua Email của bạn.
                </Typography>
                <Box mt={2}>
                  <RadioGroup
                    aria-labelledby="demo-customized-radios"
                    name="customized-radios"
                    value={selectedPaymentMethod}
                    onChange={handleChangePaymentMethod}
                  >
                    {paymentMethodsList?.length > 0 &&
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
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBooking}
                  >
                    Đặt phòng
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <RoomInfo roomInfo={hotelData?.roomTypes} booking={bookingData} />

              <RoomPricing
                numNights={numNights}
                booking={bookingData}
                roomInfo={hotelData?.roomTypes}
              />
            </Grid>
          </Grid>
        )}
      </Box>

      {/* <List>
        <ListItem>roomTypeId : {roomTypeId}</ListItem>
        <ListItem>checkIn : {checkIn}</ListItem>
        <ListItem>checkOut : {checkOut}</ListItem>
        <ListItem>numAdults : {numAdults}</ListItem>
        <ListItem>numChildren : {numChildren}</ListItem>
        <ListItem>numRooms : {numRooms}</ListItem>
        <ListItem>hotelId : {hotelId}</ListItem>
      </List> */}
    </div>
  );
}
