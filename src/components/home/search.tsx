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

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubPerson = () => {
    if (formik.values.numberOfPeople <= 1) return;
    formik.setFieldValue("numberOfPeople", formik.values.numberOfPeople - 1);
  };

  const handleAddPerson = () => {
    if (formik.values.numberOfPeople < 1) return;
    formik.setFieldValue("numberOfPeople", formik.values.numberOfPeople + 1);
  };

  const handleSubRoom = () => {
    if (formik.values.numberOfRooms <= 1) return;
    formik.setFieldValue("numberOfRooms", formik.values.numberOfRooms - 1);
  };

  const handleAddRoom = () => {
    if (formik.values.numberOfRooms < 1) return;
    formik.setFieldValue("numberOfRooms", formik.values.numberOfRooms + 1);
  };

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  const formik = useFormik({
    initialValues: {
      location: "Hà Nội",
      checkInDate: dayjs(),
      checkOutDate: dayjs(),
      numberOfPeople: 1,
      numberOfRooms: 1,
      submit: null,
    },
    validationSchema: Yup.object({
      location: Yup.string().required("Vui lòng chọn điểm đến!"),
      checkInDate: Yup.date().required("Vui lòng chọn ngày đến!"),
      checkOutDate: Yup.date().required("Vui lòng chọn ngày về!"),
      numberOfPeople: Yup.number()
        .min(1, "Số lượng người tối thiểu phải là 1!")
        .required("Vui lòng chọn số lượng người!"),
      numberOfRooms: Yup.number()
        .min(1, "Số lượng phòng tối thiểu phải là 1!")
        .required("Vui lòng chọn số lượng phòng!"),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const checkInDate = values.checkInDate.format("YYYY-MM-DD");
        const checkOutDate = values.checkOutDate.format("YYYY-MM-DD");

        console.log({
          location: values.location.trim(),
          checkInDate,
          checkOutDate,
          numberOfPeople: values.numberOfPeople,
          numberOfRooms: values.numberOfRooms,
        });

        // const response = await SearchService[API.SEARCH_HOTEL]({
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

  const handleCheckInChange = (newValue: Dayjs | null) => {
    if (newValue) {
      formik.setFieldValue("checkInDate", newValue);
      if (
        !formik.values.checkOutDate ||
        newValue.isAfter(formik.values.checkOutDate)
      ) {
        formik.setFieldValue("checkOutDate", newValue);
      }
    }
  };

  const handleCheckOutChange = (newValue: Dayjs | null) => {
    if (newValue && newValue.isAfter(formik.values.checkInDate)) {
      formik.setFieldValue("checkOutDate", newValue);
    }
  };

  return (
    <Box
      sx={{
        cursor: "default",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        p: "8px 24px",
        mt: "calc(230px - 27px)",
        borderBottom: "none",
        bgcolor: "inherit",
        display: "flex",
        position: "absolute",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          m: "0 auto",
          maxWidth: "1188px",
          boxShadow: "0px 12px 12px 0px rgba(0, 0, 0, 0.10)",
          // minHeight: "112px",
          borderRadius: "8px",
          bgcolor: "#f8f7f9",
        }}
        component="form"
        onSubmit={formik.handleSubmit}
      >
        <div style={{ width: "100%" }}>
          <div
            style={{
              border: "4px solid #ffb700",
              boxShadow: "0 2px 8px 0 rgba(26, 26, 26, 0.16)",
              borderRadius: "8px",
              padding: "4px",
            }}
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
                    sx={{ bgcolor: "background.paper", width: "100%" }}
                    minDate={dayjs()}
                    value={formik.values.checkInDate}
                    onChange={(newValue) => handleCheckInChange(newValue)}
                    // error={
                    //   !!(
                    //     formik.touched.checkInDate && formik.errors.checkInDate
                    //   )
                    // }
                    // helperText={
                    //   formik.touched.checkInDate && formik.errors.checkInDate
                    // }
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={2.5}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Ngày về"
                    name="checkOutDate"
                    sx={{ bgcolor: "background.paper", width: "100%" }}
                    minDate={formik.values.checkInDate}
                    value={formik.values.checkOutDate}
                    onChange={(newValue) => handleCheckOutChange(newValue)}
                    // error={
                    //   !!(
                    //     formik.touched.checkOutDate &&
                    //     formik.errors.checkOutDate
                    //   )
                    // }
                    // helperText={
                    //   formik.touched.checkOutDate && formik.errors.checkOutDate
                    // }
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
                      <PersonIcon
                        sx={{ fontSize: 28, color: "primary.main" }}
                      />
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
                            disabled={formik.values.numberOfPeople <= 1}
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
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="center"
                          mt={1}
                        >
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
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default SearchBar;
