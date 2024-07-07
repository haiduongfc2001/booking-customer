"use client";
import { FC } from "react";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import { AppDispatch, useAppDispatch } from "@/redux/store/store";
import { searchHotel, updateSearchParams } from "@/redux/slices/search-slice";
import { RootState, useAppSelector } from "@/redux/store/store";
import { getRequest } from "@/services/api-instance";
import { STATUS_CODE } from "@/constant/constants";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface SearchBarProps {}

interface Province {
  id: number;
  name: string;
}

interface Hotel {
  id: number;
  name: string;
  avatar: string;
}

interface Option {
  // label: string;
  // value: string;
  // type: "province" | "hotel";
  // avatar: string;
  [key: string]: any;
}

interface FormValues {
  location: string;
  checkIn: Date;
  checkOut: Date;
  numAdults: number;
  numChildren: number;
  childrenAges: number[];
  numRooms: number;
}

const SearchBar: FC<SearchBarProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [provinces, setProvinces] = React.useState<Province[]>([]);
  const [hotels, setHotels] = React.useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    location,
    checkIn,
    checkOut,
    numAdults,
    numChildren,
    childrenAges,
    numRooms,
  } = useAppSelector((state: RootState) => state.search);

  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();

  React.useEffect(() => {
    const fetchData = async () => {
      await fetchProvinces();
      await fetchHotels();
      updateCheckInIfExpired();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const updateCheckInIfExpired = () => {
    const currentDate = dayjs();
    const currentCheckIn = dayjs(checkIn);
    const currentCheckOut = dayjs(checkOut);

    if (currentCheckIn.isBefore(currentDate, "day")) {
      const newCheckIn = currentDate.format("YYYY-MM-DD");
      let newCheckOut = currentCheckOut.format("YYYY-MM-DD");

      if (
        currentCheckOut.isSame(currentDate, "day") ||
        currentCheckOut.isBefore(currentDate, "day")
      ) {
        newCheckOut = currentDate.add(1, "day").format("YYYY-MM-DD");
      } else if (
        currentCheckOut.isSame(currentCheckIn, "day") ||
        currentCheckOut.isBefore(currentCheckIn, "day")
      ) {
        newCheckOut = dayjs(newCheckIn).add(1, "day").format("YYYY-MM-DD");
      }

      dispatch(
        updateSearchParams({
          checkIn: newCheckIn,
          checkOut: newCheckOut,
        })
      );
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await getRequest("/address/getAllProvinces");

      if (response?.status === STATUS_CODE.OK) {
        setProvinces(response.data);
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await getRequest("/hotel/getHotelList");

      if (response?.status === STATUS_CODE.OK) {
        setHotels(response.data);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  const ageOptions = Array.from({ length: 17 }, (_, i) => i + 1);

  const initialValues = React.useMemo(
    () => ({
      location: location ?? "Thành phố Hà Nội",
      checkIn: dayjs(checkIn) ?? dayjs().add(1, "day"),
      checkOut: dayjs(checkOut) ?? dayjs().add(2, "day"),
      numRooms: numRooms ?? 1,
      numAdults: numAdults || 1,
      numChildren: numChildren || 0,
      childrenAges: childrenAges || [],
      submit: null,
    }),
    [
      location,
      checkIn,
      checkOut,
      numRooms,
      numAdults,
      numChildren,
      childrenAges,
    ]
  );

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      location: Yup.string().required("Vui lòng chọn điểm đến / khách sạn!"),
      // checkIn: Yup.date().min(dayjs().add(1, "day").required("Vui lòng chọn ngày đến!"),
      // checkOut: Yup.date()
      //   .required("Vui lòng chọn ngày về!")
      //   .min(dayjs().add(2, "day"), "Ngày về phải sau ngày đến ít nhất 1 ngày"),
      numAdults: Yup.number()
        .min(1, "Số lượng người lớn tối thiểu phải là 1!")
        .test({
          name: "roomCheck",
          message: "Số người lớn ở ít nhất phải bằng số phòng!",
          test: function (value) {
            const numRooms = this.parent.numRooms as number;
            return typeof value === "number" && value >= numRooms;
          },
        })
        .required("Vui lòng chọn số lượng người!"),
      numChildren: Yup.number()
        .min(0, "Số lượng người tối thiểu phải là 0!")
        .required("Vui lòng chọn số lượng trẻ em!"),
      numRooms: Yup.number()
        .min(1, "Số lượng phòng tối thiểu phải là 1!")
        .required("Vui lòng chọn số lượng phòng!"),
      childrenAges: Yup.array().of(
        Yup.number()
          .min(1, "Tuổi trẻ em phải từ 1 đến 17!")
          .max(17, "Tuổi trẻ em phải từ 1 đến 17!")
      ),
    }),

    onSubmit: async (values, helpers) => {
      try {
        const {
          location,
          checkIn,
          checkOut,
          numAdults,
          numChildren,
          childrenAges,
          numRooms,
        } = values;

        const formattedCheckIn = dayjs(checkIn).format("YYYY-MM-DD");
        const formattedCheckOut = dayjs(checkOut).format("YYYY-MM-DD");

        dispatch(
          searchHotel({
            location,
            checkIn: formattedCheckIn,
            checkOut: formattedCheckOut,
            numRooms,
            numAdults,
            numChildren,
            childrenAges,
          })
        );

        let redirectUrl = "";
        if (location.startsWith("/hotel/")) {
          redirectUrl =
            location +
            `?checkIn=${formattedCheckIn}&checkOut=${formattedCheckOut}&numAdults=${numAdults}&numChildren=${numChildren}&childrenAges=${childrenAges.join(
              ","
            )}&numRooms=${numRooms}`;
        } else {
          const searchQueryParams = new URLSearchParams({
            location,
            checkIn: formattedCheckIn,
            checkOut: formattedCheckOut,
            numAdults: String(numAdults),
            numChildren: String(numChildren),
            childrenAges: childrenAges.join(","),
            numRooms: String(numRooms),
          }).toString();
          redirectUrl = `/search?${searchQueryParams}`;
        }

        router.push(redirectUrl, { scroll: true });
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

  const handleSubAdult = () => {
    if (Number(formik.values.numAdults) > Number(formik.values.numRooms)) {
      updateFieldValue("numAdults", Number(formik.values.numAdults) - 1);
    } else if (
      Number(formik.values.numAdults) === Number(formik.values.numRooms)
    ) {
      updateFieldValue("numAdults", Number(formik.values.numAdults) - 1);
      updateFieldValue("numRooms", Number(formik.values.numRooms) - 1);
    } else {
      return;
    }
  };

  const handleAddAdult = () => {
    if (Number(formik.values.numAdults) < 1) return;
    updateFieldValue("numAdults", Number(formik.values.numAdults) + 1);
  };

  const handleSubChildren = () => {
    if (formik.values.numChildren <= 0) return;
    updateFieldValue("numChildren", formik.values.numChildren - 1);
    updateFieldValue(
      "childrenAges",
      formik.values.childrenAges.slice(0, formik.values.numChildren - 1)
    );
  };

  const handleAddChildren = () => {
    updateFieldValue("numChildren", formik.values.numChildren + 1);
    updateFieldValue("childrenAges", [...formik.values.childrenAges, 1]);
  };

  const handleSubRoom = () => {
    if (Number(formik.values.numRooms) <= 1) {
      return;
    } else {
      updateFieldValue("numRooms", Number(formik.values.numRooms) - 1);
      if (formik.values.numAdults < Number(formik.values.numRooms)) {
        updateFieldValue("numAdults", Number(formik.values.numRooms));
      }
    }
  };

  const handleAddRoom = () => {
    if (Number(formik.values.numRooms) < 1) {
      return;
    } else {
      updateFieldValue("numRooms", Number(formik.values.numRooms) + 1);
      if (formik.values.numAdults <= Number(formik.values.numRooms)) {
        updateFieldValue("numAdults", Number(formik.values.numAdults) + 1);
      }
    }
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

  const handleChildrenAgeChange = (index: number, age: number) => {
    const updatedChildrenAges: number[] = [...formik.values.childrenAges];
    updatedChildrenAges[index] = age;
    updateFieldValue("childrenAges", updatedChildrenAges);
  };

  // Assuming you have a way to distinguish between provinces and hotels in your data
  const options: Option[] = [
    ...provinces.map((province) => ({
      label: province.name,
      value: province.name,
      type: "province",
      avatar: "",
    })),
    ...hotels.map((hotel) => ({
      label: hotel.name,
      value: `/hotel/${hotel.id}`,
      type: "hotel",
      avatar: hotel.avatar,
    })),
  ];

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
          <Autocomplete
            id="location"
            autoHighlight
            fullWidth
            noOptionsText={"Không có sự lựa chọn nào"}
            sx={{
              bgcolor: "background.paper",
              width: "100%",
              boxShadow: 1,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              borderRadius: 1,
              "&:hover": {
                bgcolor: "neutral.100",
              },
            }}
            options={isLoading ? [] : options}
            value={
              options.find((opt) => opt.value === formik.values.location) ||
              "Thành phố Hà Nội"
            }
            onChange={(event, newValue) => {
              formik.setFieldValue("location", newValue?.value || "");
            }}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label
            }
            getOptionLabel={(option) => option.label || ""}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                key={option.value}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {option.type === "province" ? (
                  <LocationOnIcon sx={{ marginRight: 2 }} />
                ) : (
                  <Avatar src={option.avatar} sx={{ marginRight: 2 }} />
                )}
                {option.label}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn điểm đến / khách sạn"
                error={Boolean(formik.errors.location)}
                helperText={formik.errors.location}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày đến"
              name="checkIn"
              format="DD/MM/YYYY"
              sx={{
                bgcolor: "background.paper",
                width: "100%",
                "&.MuiFormControl-root": {
                  borderRadius: 1,
                },
              }}
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

        <Grid item xs={12} sm={6} md={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Ngày về"
              name="checkOut"
              format="DD/MM/YYYY"
              sx={{
                bgcolor: "background.paper",
                width: "100%",
                "&.MuiFormControl-root": {
                  borderRadius: 1,
                },
              }}
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

        <Grid item xs={12} md={3.5}>
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
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems={"center"}
                >
                  <Typography
                    variant="h6"
                    color="textPrimary"
                    fontSize="16px"
                    fontWeight="600"
                  >
                    {formik.values.numAdults} người lớn
                  </Typography>
                  {formik.values.numChildren > 0 && (
                    <Typography
                      variant="h6"
                      color="textPrimary"
                      fontSize="16px"
                      fontWeight="600"
                    >
                      , {formik.values.numChildren} trẻ em
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {formik.values.numRooms} phòng
                </Typography>
              </Stack>
            </Button>
            {open && (
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
                sx={{ width: "auto" }}
              >
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle1" minWidth="100px">
                      Số người lớn
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
                      onClick={handleSubAdult}
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
                      onClick={handleAddAdult}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>

                  <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                    <Typography variant="subtitle1" minWidth="100px">
                      Số trẻ em
                    </Typography>
                    <IconButton
                      size="small"
                      sx={{
                        width: "28px",
                        height: "28px",
                        border: "1px solid",
                        color:
                          formik.values.numChildren > 0
                            ? "primary.main"
                            : "inherit",
                        borderColor: "rgb(168, 179, 203)",
                        borderRadius: "50%",
                        cursor: "pointer",
                        "&:hover": {
                          background: "rgb(237, 240, 249)",
                        },
                      }}
                      disabled={formik.values.numChildren <= 0}
                      onClick={handleSubChildren}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography variant="h6">
                      {formik.values.numChildren}
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
                      onClick={handleAddChildren}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>

                  {formik.values.numChildren > 0 && (
                    <Box mt={2}>
                      {formik.values.childrenAges?.map(
                        (age: number, index: number) => (
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            key={index}
                            mt={1}
                          >
                            <Typography variant="subtitle1" minWidth="100px">
                              Tuổi trẻ {index + 1}
                            </Typography>
                            <FormControl fullWidth>
                              <Select
                                labelId={`age-select-label-${index}`}
                                id={`age-select-${index}`}
                                value={age}
                                label="Age"
                                onMouseDown={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleChildrenAgeChange(
                                    index,
                                    Number(e.target.value)
                                  )
                                }
                              >
                                {ageOptions.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        )
                      )}
                    </Box>
                  )}

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
            )}
          </div>
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
      </Grid>
    </Box>
  );
};

export default SearchBar;
