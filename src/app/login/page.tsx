"use client";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
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
  CircularProgress,
} from "@mui/material";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ALERT_TYPE, API, STATUS_CODE } from "@/constant/constants";
import { postRequest } from "@/services/api-instance";
import { updateAccessToken } from "@/services/storage";
import { useAppDispatch } from "@/redux/store/store";
import { openAlert } from "@/redux/slices/alert-slice";
import { login } from "@/redux/slices/auth-slice";
import { AppDispatch } from "@/redux/store/store";

const LoginPage = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useAppDispatch();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "haiduongtb2001@gmail.com",
      password: "123456Aa",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      password: Yup.string().required("Vui lòng nhập mật khẩu!"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        setIsLoading(true);

        const { email, password } = values;

        const res = await postRequest(API.CUSTOMER.LOGIN, { email, password });

        if (res?.status === STATUS_CODE.OK && res?.token && res.customer) {
          dispatch(login({ email, customer_id: res.customer?.id }));
          updateAccessToken(res?.token);
          dispatch(
            openAlert({
              type: ALERT_TYPE.SUCCESS,
              message: res?.message || "Logged in successfully!",
            })
          );
          router.push("/");
          formik.resetForm();
        } else {
          dispatch(
            openAlert({
              type: ALERT_TYPE.ERROR,
              message: res?.data?.error || "Login Failed!",
            })
          );
        }
      } catch (err: any) {
        dispatch(
          openAlert({
            type: ALERT_TYPE.ERROR,
            message:
              err.response?.data?.message || "Đã xảy ra lỗi không mong muốn.",
          })
        );
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source
          src="https://gcs.tripi.vn/tripi-assets/mytour/videos/video_bg_mytour.mov"
          type="video/mp4"
        />
      </video>
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
            <Typography variant="h4">Đăng nhập</Typography>
            <Typography color="text.secondary" variant="body2">
              Bạn chưa có tài khoản? &nbsp;
              <Link
                component={NextLink}
                href="/register"
                underline="hover"
                variant="subtitle2"
              >
                Đăng ký
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
                <span>Đăng nhập</span>
              )}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
