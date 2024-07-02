"use client";
import React, { FC, useRef, useState } from "react";
import {
  Avatar,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { userInfo } from "@/utils/data";
import { getInitials } from "@/utils/get-initials";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomizedBadges from "@/lib/badge";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { closeLoadingApi, openLoadingApi } from "@/redux/slices/loading-slice";
import { getRequest } from "@/services/api-instance";
import { GENDER, STATUS_CODE } from "@/constant/constants";

interface IAccountManagement {}

const AccountManagement: FC<IAccountManagement> = () => {
  const [customerData, setCustomerData] = React.useState({
    email: "",
    full_name: "",
    gender: "",
    phone: "",
    avatar: "",
  });

  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  const customer_id = useSelector((state: RootState) => state.auth.customer_id);

  React.useEffect(() => {
    const fetchCustomer = async () => {
      if (!customer_id) return;

      dispatch(openLoadingApi());

      try {
        const response = await getRequest(
          `/customer/${customer_id}/getCustomerById`
        );

        if (response && response.status === STATUS_CODE.OK) {
          setCustomerData(response.data);
        }
      } catch (error: any) {
        console.error(error.response?.data?.message || error.message);
      } finally {
        dispatch(closeLoadingApi());
      }
    };

    fetchCustomer();
  }, [customer_id, dispatch]);

  const formik = useFormik({
    initialValues: {
      email: customerData?.email,
      full_name: customerData?.full_name,
      gender: customerData?.gender,
      phone: customerData?.phone,
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Vui lòng nhập địa chỉ email hợp lệ!")
        .max(255)
        .required("Vui lòng nhập địa chỉ email!"),
      full_name: Yup.string().max(30).required("Vui lòng nhập họ và tên!"),
      phone: Yup.string().max(30).required("Vui lòng nhập số điện thoại!"),
      gender: Yup.mixed()
        .oneOf([GENDER.MALE, GENDER.FEMALE, GENDER.OTHER])
        .required("Vui lòng nhập giới tính của bạn!"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        console.log("Submitted values:", values);
        alert("Cập nhật thông tin tài khoản thành công!");
      } catch (err: any) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;
    if (fileList && fileList.length === 1) {
      const selectedFile = fileList[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Thông báo cho người dùng nếu chọn nhiều hơn hoặc không chọn file
      alert("Vui lòng chỉ chọn duy nhất một ảnh!");
      // Đặt giá trị của input type="file" về null để cho phép người dùng chọn lại file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    // Đặt giá trị của input type="file" về null để cho phép người dùng chọn lại file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpdate = () => {
    // Cập nhật ảnh cho userInfo?.avatar
    // Có thể lưu ảnh vào state của component cha hoặc gửi lên server
    // Sau khi cập nhật, thông báo cho người dùng
    alert("Cập nhật ảnh thành công");
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sm={3}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <CustomizedBadges
            badgeContent={
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  display: "flex",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)",
                  alignItems: "center",
                  borderRadius: "50%",
                  justifyContent: "center",
                  bgcolor: "background.paper",
                  color: "neutral.900",
                  "&:hover": {
                    bgcolor: "neutral.200",
                  },
                }}
              >
                <IconButton
                  size="small"
                  color="inherit"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CameraAltOutlinedIcon />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileInputChange}
                  />
                </IconButton>
              </Box>
            }
          >
            <Avatar
              src={selectedImage || userInfo?.avatar || ""}
              alt={customerData?.email}
              sx={{
                bgcolor: "primary.light",
                color: "primary.main",
                width: 128,
                height: 128,
              }}
            >
              {getInitials(userInfo?.name)}
            </Avatar>
          </CustomizedBadges>

          {selectedImage && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                my: 2,
                "& > :not(:last-child)": {
                  marginRight: 1, // Thêm margin-right 4px cho các phần tử không phải là phần tử cuối cùng
                },
              }}
            >
              <Button variant="contained" color="error" onClick={handleCancel}>
                Hủy
              </Button>
              <Button variant="contained" onClick={handleUpdate}>
                Cập nhật ảnh
              </Button>
            </Box>
          )}
        </Grid>
        <Grid item xs={12} sm={9} md={6}>
          <form noValidate onSubmit={formik.handleSubmit} autoComplete="off">
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                size="small"
                InputProps={{
                  readOnly: true,
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
                      value={GENDER.MALE}
                      control={<Radio />}
                      label="Nam"
                    />
                    <FormControlLabel
                      value={GENDER.FEMALE}
                      control={<Radio />}
                      label="Nữ"
                    />
                    <FormControlLabel
                      value={GENDER.OTHER}
                      control={<Radio />}
                      label="Khác"
                    />
                  </RadioGroup>
                  {formik.touched.gender && formik.errors.gender && (
                    <FormHelperText>{formik.errors.gender}</FormHelperText>
                  )}
                </FormControl>
              </div>
            </Stack>
            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
            <Button
              fullWidth
              size="medium"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
            >
              Cập nhật
            </Button>
          </form>
        </Grid>
      </Grid>
    </>
  );
};

export default AccountManagement;
