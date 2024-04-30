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
} from "@mui/material";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const RegisterPage = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState<boolean>(false);

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
      email: "",
      password: "",
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
        console.log("Submitted values:", values);

        alert("Đăng nhập thành công!");

        // await auth.login(values.email, values.password);
        // router.push("/");
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
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
              Đăng nhập
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
