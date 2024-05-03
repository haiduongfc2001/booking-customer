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
import { useFormik } from "formik";
import * as Yup from "yup";
// import { API, STATUS_CODE, TOAST_KIND } from "../../constant/constants";
import Popover from "@mui/material/Popover";
import PersonIcon from "@mui/icons-material/Person";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import HotelIcon from "@mui/icons-material/Hotel";
import { useRouter } from "next/navigation";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  const formik = useFormik({
    initialValues: {
      location: "Hà Nội",
      checkInDate: dayjs(),
      checkOutDate: dayjs().add(1, "day"),
      numberOfPeople: 1,
      numberOfRooms: 1,
      submit: null,
    },
    validationSchema: Yup.object({
      location: Yup.string().required("Vui lòng chọn điểm đến!"),
      checkInDate: Yup.date().required("Vui lòng chọn ngày đến!"),
      checkOutDate: Yup.date()
        .required("Vui lòng chọn ngày về!")
        .min(dayjs().add(1, "day"), "Ngày về phải sau ngày đến ít nhất 1 ngày"),
      numberOfPeople: Yup.number()
        .min(1, "Số lượng người tối thiểu phải là 1!")
        .test({
          name: "roomCheck",
          message: "Số người ở ít nhất phải bằng số phòng!",
          test: function (value) {
            const numberOfRooms = this.parent.numberOfRooms as number;
            return typeof value === "number" && value >= numberOfRooms;
          },
        })
        .required("Vui lòng chọn số lượng người!"),
      numberOfRooms: Yup.number()
        .min(1, "Số lượng phòng tối thiểu phải là 1!")
        .required("Vui lòng chọn số lượng phòng!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const {
          location,
          checkInDate,
          checkOutDate,
          numberOfPeople,
          numberOfRooms,
        } = values;

        const formattedCheckInDate = checkInDate.format("YYYY-MM-DD");
        const formattedCheckOutDate = checkOutDate.format("YYYY-MM-DD");

        const searchQueryParams = new URLSearchParams({
          location,
          checkInDate: formattedCheckInDate,
          checkOutDate: formattedCheckOutDate,
          numberOfPeople: String(numberOfPeople),
          numberOfRooms: String(numberOfRooms),
        }).toString();

        router.push(`/search?${searchQueryParams}`, { scroll: true });

        // const response = await SearchService[API.SEARCH.HOTEL]({
        //   location: values.location.trim(),
        //   checkInDate: checkInDate,
        //   checkOutDate: checkOutDate,
        // });

        // if (response?.status === STATUS_CODE.CREATED) {
        //   onRefresh();
        //   dispatch(showCommonAlert(TOAST_KIND.SUCCESS, response.message));
        // } else {
        //   dispatch(showCommonAlert(TOAST_KIND.ERROR, response.data.message));
        // }
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
    if (
      formik.values.numberOfPeople > 1 &&
      formik.values.numberOfPeople >= formik.values.numberOfRooms
    ) {
      updateFieldValue("numberOfPeople", formik.values.numberOfPeople - 1);
    } else return;
  };

  const handleAddPerson = () => {
    if (formik.values.numberOfPeople < 1) return;
    updateFieldValue("numberOfPeople", formik.values.numberOfPeople + 1);
  };

  const handleSubRoom = () => {
    if (formik.values.numberOfRooms <= 1) {
      return;
    } else {
      updateFieldValue("numberOfRooms", formik.values.numberOfRooms - 1);
      if (formik.values.numberOfPeople < formik.values.numberOfRooms) {
        updateFieldValue("numberOfPeople", formik.values.numberOfRooms);
      }
    }
  };

  const handleAddRoom = () => {
    if (formik.values.numberOfRooms < 1) {
      return;
    } else {
      updateFieldValue("numberOfRooms", formik.values.numberOfRooms + 1);
      if (formik.values.numberOfPeople <= formik.values.numberOfRooms) {
        updateFieldValue("numberOfPeople", formik.values.numberOfPeople + 1);
      }
    }
  };

  const handleCheckInChange = (newValue: Dayjs | null) => {
    if (newValue) {
      updateFieldValue("checkInDate", newValue);
      const minCheckOutDate = newValue.add(1, "day");
      if (formik.values.checkOutDate.isBefore(minCheckOutDate)) {
        updateFieldValue("checkOutDate", minCheckOutDate);
      }
    }
  };

  const handleCheckOutChange = (newValue: Dayjs | null) => {
    if (newValue) {
      updateFieldValue("checkOutDate", newValue);
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
            helperText={formik.touched.location && formik.errors.location}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2.5}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày đến"
              name="checkInDate"
              format="DD/MM/YYYY"
              sx={{ bgcolor: "background.paper", width: "100%" }}
              minDate={dayjs()}
              value={formik.values.checkInDate}
              onChange={(newValue) => handleCheckInChange(newValue)}
              slotProps={{
                textField: {
                  error:
                    formik.touched.checkInDate &&
                    Boolean(formik.errors.checkInDate),
                  helperText:
                    formik.touched.checkInDate &&
                    typeof formik.errors.checkInDate === "string"
                      ? formik.errors.checkInDate
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
              name="checkOutDate"
              format="DD/MM/YYYY"
              sx={{ bgcolor: "background.paper", width: "100%" }}
              minDate={formik.values.checkInDate.add(1, "day")}
              value={formik.values.checkOutDate}
              onChange={(newValue) => handleCheckOutChange(newValue)}
              slotProps={{
                textField: {
                  error:
                    formik.touched.checkOutDate &&
                    Boolean(formik.errors.checkOutDate),
                  helperText:
                    formik.touched.checkOutDate &&
                    typeof formik.errors.checkOutDate === "string"
                      ? formik.errors.checkOutDate
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
                    {formik.values.numberOfPeople} người
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {formik.values.numberOfRooms} phòng
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
                          formik.values.numberOfPeople > 1
                            ? "primary.main"
                            : "inherit",
                        borderColor: "rgb(168, 179, 203)",
                        borderRadius: "50%",
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgb(237, 240, 249)",
                        },
                      }}
                      disabled={
                        formik.values.numberOfPeople <= 1 ||
                        formik.values.numberOfPeople ===
                          formik.values.numberOfRooms
                      }
                      onClick={handleSubPerson}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h6">
                      {formik.values.numberOfPeople}
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
                          formik.values.numberOfRooms > 1
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
                      disabled={formik.values.numberOfRooms <= 1}
                      onClick={handleSubRoom}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h6">
                      {formik.values.numberOfRooms}
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

        {formik.errors.submit && (
          <Typography color="error" sx={{ mt: 3 }} variant="body2">
            {formik.errors.submit}
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default SearchBar;
