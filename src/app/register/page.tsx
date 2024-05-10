"use client";
import NextLink from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Link,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Tooltip,
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { API } from "@/constant/constants";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import CustomizedSnackbars from "@/lib/snackbar";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [showRepeatPassword, setShowRepeatPassword] =
    React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [snackbar, setSnackbar] = React.useState<ISnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const router = useRouter();

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseDownRepeatPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword(!showRepeatPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      full_name: "",
      gender: "",
      password: "",
      repeatPassword: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      full_name: Yup.string().max(255).required("Vui lòng nhập họ và tên!"),
      gender: Yup.mixed()
        .oneOf(["male", "female", "other"])
        .required("Vui lòng nhập giới tính của bạn!"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự!")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/,
          "Mật khẩu phải chứa ít nhất 1 chữ cái thường, 1 chữ cái in hoa và 1 ký tự số!"
        )
        .required("Vui lòng nhập mật khẩu!"),
      repeatPassword: Yup.string()
        .max(255)
        .required("Vui lòng nhập lại mật khẩu!")
        // Custom validation to ensure repeatPassword matches password
        .oneOf([Yup.ref("password")], "Mật khẩu không khớp!"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        const { email, full_name, gender, password } = values;
        setIsLoading(true);

        axios
          .post(API.CUSTOMER.REGISTER, {
            email,
            full_name,
            gender,
            password,
          })
          .then(function (response) {
            formik.resetForm();
            setSnackbar({
              open: true,
              message: response.data.message,
              severity: "success",
            });

            const timeout = setTimeout(() => {
              router.push("/account/verify");
            }, 3000);

            return () => clearTimeout(timeout);
          })
          .catch(function (error) {
            setSnackbar({
              open: true,
              message: error.response.data.message,
              severity: "error",
            });
          })
          .finally(function () {
            setIsLoading(false);
          });
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  React.useEffect(() => {
    if (snackbar.open) {
      const timeout = setTimeout(() => {
        setSnackbar({
          open: false,
          message: "",
          severity: "success",
        });
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [snackbar.open]);

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     const { data, error } = useCustomAPI(API.CUSTOMER.REGISTER, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         email: formik.values.email,
  //         full_name: formik.values.full_name,
  //         gender: formik.values.gender,
  //         password: formik.values.password,
  //       }),
  //     });

  //     if (error) {
  //       // Handle API errors here, e.g., display an error message to the user
  //       console.error("API error:", error);
  //       return; // or set formik status to error
  //     }

  //     if (data) {
  //       alert(data.message);
  //     }
  //   } catch (err) {
  //     console.error("Error submitting form:", err);
  //     // Handle other errors here, e.g., display an error message to the user
  //   }
  // };

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        backgroundImage:
          "url('https://r4.wallpaperflare.com/wallpaper/282/810/421/ocean-summer-summertime-hotel-wallpaper-0930282db19afdabf6d7485f2031463d.jpg    ')",
      }}
    >
      <Box
        sx={{
          maxWidth: 550,
          mx: 3,
          my: 5,
          width: "100%",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 2,
            width: "100%",
            borderRadius: 1,
            bgcolor: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">Đăng ký</Typography>
            <Typography color="text.secondary" variant="body2">
              Bạn đã có tài khoản? &nbsp;
              <Link
                component={NextLink}
                href="/login"
                underline="hover"
                variant="subtitle2"
              >
                Đăng nhập
              </Link>
            </Typography>
          </Stack>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
              <TextField
                autoFocus
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
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                error={!!(formik.touched.email && formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth
                label="Họ và tên"
                name="full_name"
                placeholder="Nhập tên của bạn"
                size="small"
                sx={{
                  "& .MuiInputBase-input": {
                    bgcolor: "background.paper",
                  },
                }}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.full_name}
                error={!!(formik.touched.full_name && formik.errors.full_name)}
                helperText={formik.touched.full_name && formik.errors.full_name}
              />
              <div>
                <FormControl
                  sx={{ px: 1.5 }}
                  error={!!(formik.touched.gender && formik.errors.gender)}
                >
                  <FormLabel
                    component="legend"
                    id="radio-buttons-group-gender-label"
                  >
                    Giới tính
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="radio-buttons-group-gender-label"
                    name="gender"
                    onBlur={formik.handleBlur}
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                  >
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Nam"
                    />
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Nữ"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="Khác"
                    />
                  </RadioGroup>
                  {formik.touched.gender && formik.errors.gender && (
                    <FormHelperText>{formik.errors.gender}</FormHelperText>
                  )}
                </FormControl>
              </div>
              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                placeholder="Nhập mật khẩu của bạn"
                type={showPassword ? "text" : "password"}
                size="small"
                sx={{
                  "& .MuiInputBase-input": {
                    bgcolor: "background.paper",
                  },
                  "& .MuiInputBase-root.MuiFilledInput-root": {
                    bgcolor: "#ffffff",
                  },
                }}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                error={!!(formik.touched.password && formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  endAdornment: formik.values.password && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{
                          color: "icon.main",
                          mr: 1,
                        }}
                      >
                        {showPassword ? (
                          <Tooltip title="Ẩn mật khẩu">
                            <VisibilityOff />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Hiển thị mật khẩu">
                            <Visibility />
                          </Tooltip>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Nhập lại mật khẩu"
                name="repeatPassword"
                placeholder="Nhập lại mật khẩu của bạn"
                size="small"
                type={showRepeatPassword ? "text" : "password"}
                sx={{
                  "& .MuiInputBase-input": {
                    bgcolor: "background.paper",
                  },
                  "& .MuiInputBase-root.MuiFilledInput-root": {
                    bgcolor: "#ffffff",
                  },
                }}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.repeatPassword}
                error={
                  !!(
                    formik.touched.repeatPassword &&
                    formik.errors.repeatPassword
                  )
                }
                helperText={
                  formik.touched.repeatPassword && formik.errors.repeatPassword
                }
                InputProps={{
                  endAdornment: formik.values.repeatPassword && (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle repeat-password visibility"
                        onClick={toggleRepeatPasswordVisibility}
                        onMouseDown={handleMouseDownRepeatPassword}
                        edge="end"
                        sx={{
                          color: "icon.main",
                          mr: 1,
                        }}
                      >
                        {showPassword ? (
                          <Tooltip title="Ẩn mật khẩu">
                            <VisibilityOff />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Hiển thị mật khẩu">
                            <Visibility />
                          </Tooltip>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
            >
              {isLoading ? (
                <Box display="flex" alignItems="center">
                  &nbsp;&nbsp;
                  <CircularProgress size={25} color="inherit" />
                </Box>
              ) : (
                <span>Đăng ký</span>
              )}
            </Button>
          </form>
        </Box>
      </Box>

      {snackbar?.open && (
        <CustomizedSnackbars
          message={snackbar.message}
          severity={
            snackbar.severity as "success" | "error" | "info" | "warning"
          }
        />
      )}
    </Box>
  );
}
