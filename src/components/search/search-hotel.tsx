"use client";
import { FC } from "react";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  Button,
  ClickAwayListener,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";
import Popover from "@mui/material/Popover";
import PersonIcon from "@mui/icons-material/Person";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import HotelIcon from "@mui/icons-material/Hotel";
import { useRouter } from "next/navigation";
import { FormikValues, useFormik } from "formik";
import * as Yup from "yup";

interface SearchHotelProps {
  location: string;
  checkIn: Dayjs;
  checkOut: Dayjs;
  numAdults: number;
  numRooms: number;
}

const SearchHotel: FC<SearchHotelProps> = ({
  location = "",
  checkIn = dayjs(),
  checkOut = dayjs().add(1, "day"),
  numAdults = 1,
  numRooms = 1,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const router = useRouter();

  const initialValues: FormikValues = {
    location,
    checkIn,
    checkOut,
    numAdults,
    numRooms,
  };

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      location: Yup.string().required("Vui lòng chọn điểm đến!"),
      checkIn: Yup.date().required("Vui lòng chọn ngày đến!"),
      checkOut: Yup.date().required("Vui lòng chọn ngày về!"),
      // .min(dayjs().add(1, "day"), "Ngày về phải sau ngày đến ít nhất 1 ngày"),
      numAdults: Yup.number()
        .min(1, "Số lượng người tối thiểu phải là 1!")
        .required("Vui lòng chọn số lượng người!"),
      numRooms: Yup.number()
        .min(1, "Số lượng phòng tối thiểu phải là 1!")
        .required("Vui lòng chọn số lượng phòng!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const { location, checkIn, checkOut, numAdults, numRooms } = values;

        const formattedCheckIn = checkIn.format("YYYY-MM-DD");
        const formattedCheckOut = checkOut.format("YYYY-MM-DD");

        const searchQueryParams = new URLSearchParams({
          location,
          checkIn: formattedCheckIn,
          checkOut: formattedCheckOut,
          numAdults: String(numAdults),
          numRooms: String(numRooms),
        }).toString();

        router.push(`/search?${searchQueryParams}`, { scroll: true });
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const updateFieldValue = (field: string, newValue: any) => {
    formik.setFieldValue(field, newValue);
  };

  const handleSubPerson = () => {
    if (formik.values.numAdults <= 1) return;
    updateFieldValue("numAdults", formik.values.numAdults - 1);
  };

  const handleAddPerson = () => {
    if (formik.values.numAdults < 1) return;
    updateFieldValue("numAdults", formik.values.numAdults + 1);
  };

  const handleSubRoom = () => {
    if (formik.values.numRooms <= 1) return;
    updateFieldValue("numRooms", formik.values.numRooms - 1);
  };

  const handleAddRoom = () => {
    if (formik.values.numRooms < 1) return;
    updateFieldValue("numRooms", formik.values.numRooms + 1);
  };

  const handleCheckInChange = (newValue: Dayjs | null) => {
    if (newValue) {
      updateFieldValue("checkIn", newValue);
      const minCheckOut = newValue.add(1, "day");
      if (formik.values.checkOut.isBefore(minCheckOut)) {
        updateFieldValue("checkOut", minCheckOut);
      }
    }
  };

  const handleCheckOutChange = (newValue: Dayjs | null) => {
    if (newValue) {
      updateFieldValue("checkOut", newValue);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        border: "4px solid #ffb700",
        bgcolor: "rgba(255, 255, 255, 0.8)",
        boxShadow: "0 2px 8px 0 rgba(26, 26, 26, 0.16)",
        borderRadius: "8px",
        padding: "4px",
      }}
      component="form"
      onSubmit={formik.handleSubmit}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={2.5}>
          <TextField
            fullWidth
            required
            label="Địa điểm"
            placeholder="Bạn muốn đến đâu?"
            name="location"
            type="text"
            sx={{
              "& .MuiInputBase-input": {
                bgcolor: "background.paper",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HotelIcon />
                </InputAdornment>
              ),
            }}
            onBlur={formik.handleBlur}
            value={formik.values.location}
            onChange={formik.handleChange}
            error={!!(formik.touched.location && formik.errors.location)}
            // helperText={formik.touched.location && formik.errors.location}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày đến"
              name="checkIn"
              format="DD/MM/YYYY"
              sx={{ bgcolor: "background.paper", width: "100%" }}
              minDate={dayjs()}
              value={formik.values.checkIn}
              onChange={(newValue) => handleCheckInChange(newValue)}
              slotProps={{
                textField: {
                  error:
                    formik.touched.checkIn && Boolean(formik.errors.checkIn),
                  helperText:
                    formik.touched.checkIn &&
                    typeof formik.errors.checkIn === "string"
                      ? formik.errors.checkIn
                      : "",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày về"
              name="checkOut"
              format="DD/MM/YYYY"
              sx={{ bgcolor: "background.paper", width: "100%" }}
              minDate={formik.values.checkIn.add(1, "day")}
              value={formik.values.checkOut}
              onChange={(newValue) => handleCheckOutChange(newValue)}
              slotProps={{
                textField: {
                  error:
                    formik.touched.checkOut && Boolean(formik.errors.checkOut),
                  helperText:
                    formik.touched.checkOut &&
                    typeof formik.errors.checkOut === "string"
                      ? formik.errors.checkOut
                      : "",
                },
              }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} md={2.5}>
          <ClickAwayListener onClickAway={handleClose}>
            <div>
              <Button
                variant="contained"
                color="inherit"
                onClick={handleClick}
                sx={{
                  bgcolor: "background.paper",
                  width: "100%",
                  boxShadow: 1,
                  p: 1,
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <PersonIcon sx={{ fontSize: 28, color: "primary.main" }} />
                <Stack direction="column" pl={1} alignItems="flex-start">
                  <Typography
                    variant="h6"
                    color="textPrimary"
                    fontSize="16px"
                    fontWeight="600"
                  >
                    {formik.values.numAdults} người
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formik.values.numRooms} phòng
                  </Typography>
                </Stack>
              </Button>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle1" minWidth="100px">
                      Số người
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        width: "28px",
                        height: "28px",
                        border: "1px solid",
                        color:
                          formik.values.numAdults > 1
                            ? "primary.main"
                            : "inherit",
                        borderColor: "rgb(168, 179, 203)",
                        borderRadius: "50%",
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgb(237, 240, 249)",
                        },
                      }}
                      disabled={formik.values.numAdults <= 1}
                      onClick={handleSubPerson}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h6">
                      {formik.values.numAdults}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        width: "28px",
                        height: "28px",
                        color: "primary.main",
                        border: "1px solid",
                        borderColor: "rgb(168, 179, 203)",
                        borderRadius: "50%",
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgb(237, 240, 249)",
                        },
                      }}
                      onClick={handleAddPerson}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <Typography variant="subtitle1" minWidth="100px">
                      Số phòng
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        width: "28px",
                        height: "28px",
                        color:
                          formik.values.numRooms > 1
                            ? "primary.main"
                            : "inherit",
                        border: "1px solid",
                        borderColor: "rgb(168, 179, 203)",
                        borderRadius: "50%",
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgb(237, 240, 249)",
                        },
                      }}
                      disabled={formik.values.numRooms <= 1}
                      onClick={handleSubRoom}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h6">
                      {formik.values.numRooms}
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        width: "28px",
                        height: "28px",
                        border: "1px solid",
                        color: "primary.main",
                        borderColor: "rgb(168, 179, 203)",
                        borderRadius: "50%",
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgb(237, 240, 249)",
                        },
                      }}
                      onClick={handleAddRoom}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>
                </Box>
              </Popover>
            </div>
          </ClickAwayListener>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              width: "100%",
              minHeight: "32px",
              textTransform: "uppercase",
            }}
            startIcon={<SearchIcon />}
            aria-label="find hotel"
          >
            Tìm
          </Button>
        </Grid>

        {/* {formik.errors.submit && (
          <Typography color="error" sx={{ mt: 3 }} variant="body2">
            {formik.errors.submit}
          </Typography>
        )} */}
      </Grid>
    </Box>
  );
};

export default SearchHotel;
