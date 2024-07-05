"use client";
import React, { FC, useEffect, useMemo, useRef, useState } from "react";
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
  Paper,
} from "@mui/material";
import { getInitials } from "@/utils/get-initials";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomizedBadges from "@/lib/badge";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { AppDispatch, RootState } from "@/redux/store/store";
import { useAppDispatch, useAppSelector } from "@/redux/store/store";
import { closeLoadingApi, openLoadingApi } from "@/redux/slices/loading-slice";
import { getRequest, patchRequest } from "@/services/api-instance";
import { ALERT_TYPE, GENDER, STATUS_CODE } from "@/constant/constants";
import { openAlert } from "@/redux/slices/alert-slice";

interface IAccountManagement {}

const AccountManagement: FC<IAccountManagement> = () => {
  const [customerData, setCustomerData] = useState({
    email: "",
    full_name: "",
    gender: "",
    phone: "",
    avatar: "",
  });

  const dispatch: AppDispatch = useAppDispatch();
  const customer_id = useAppSelector(
    (state: RootState) => state.auth.customer_id
  );

  const fetchCustomer = React.useCallback(async () => {
    if (!customer_id) return;

    dispatch(openLoadingApi());

    try {
      const response = await getRequest(
        `/customer/${customer_id}/getCustomerById`
      );

      if (response?.status === STATUS_CODE.OK) {
        setCustomerData(response.data);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    } finally {
      dispatch(closeLoadingApi());
    }
  }, [customer_id, dispatch]);

  useEffect(() => {
    fetchCustomer();
  }, [customer_id, fetchCustomer]);

  const initialValues = useMemo(
    () => ({
      email: customerData?.email || "",
      full_name: customerData?.full_name || "",
      gender: customerData?.gender || "",
      phone: customerData?.phone || "",
      avatar: customerData?.avatar || "",
      submit: null,
    }),
    [
      customerData?.email,
      customerData?.full_name,
      customerData?.gender,
      customerData?.phone,
      customerData?.avatar,
    ]
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
        .max(10, "Số điện thoại phải dài chính xác 10 ký tự!"),
      gender: Yup.mixed()
        .oneOf([GENDER.MALE, GENDER.FEMALE, GENDER.OTHER])
        .required("Vui lòng nhập giới tính của bạn!"),
    }),
    onSubmit: async (values, helpers) => {
      dispatch(openLoadingApi());
      try {
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("full_name", values.full_name);
        formData.append("gender", values.gender);
        formData.append("phone", values.phone);

        if (fileInputRef.current?.files?.[0]) {
          formData.append("avatar", fileInputRef.current.files[0]);
        }

        const res = await patchRequest(
          `/customer/${customer_id}/updateCustomer`,
          formData
        );

        if (res?.status === STATUS_CODE.OK) {
          dispatch(
            openAlert({
              type: ALERT_TYPE.SUCCESS,
              message: res?.message,
            })
          );
          await fetchCustomer();
          helpers.resetForm({
            values: {
              ...values,
              submit: null,
            },
          });
          setSelectedImage(null);
        } else {
          dispatch(
            openAlert({
              type: ALERT_TYPE.ERROR,
              message: res?.data?.error || "Cập nhật thất bại!",
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
        dispatch(closeLoadingApi());
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
      dispatch(
        openAlert({
          type: ALERT_TYPE.WARNING,
          message: "Vui lòng chỉ chọn duy nhất một ảnh!",
        })
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancel = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Quản lý tài khoản
      </Typography>
      <form noValidate onSubmit={formik.handleSubmit} autoComplete="off">
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={5}
            md={4}
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
                src={selectedImage || customerData?.avatar || ""}
                alt={customerData?.email}
                sx={{
                  bgcolor: "primary.light",
                  color: "primary.main",
                  width: 128,
                  height: 128,
                }}
              >
                {getInitials(customerData?.full_name)}
              </Avatar>
            </CustomizedBadges>

            {selectedImage && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 2,
                  "& > :not(:last-child)": {
                    marginRight: 1,
                  },
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Cập nhật ảnh
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={7} md={8}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                placeholder="Nhập email của bạn"
                size="small"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                error={!!(formik.touched.email && formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="full_name"
                  placeholder="Nhập họ và tên của bạn"
                  size="small"
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
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  placeholder="Nhập số điện thoại của bạn"
                  size="small"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  error={!!(formik.touched.phone && formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Stack>
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
            </Stack>
            {formik.errors.submit && (
              <Typography color="error" sx={{ mt: 3 }} variant="body2">
                {formik.errors.submit}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                size="medium"
                sx={{
                  mt: 3,
                  ml: "auto",
                }}
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting}
              >
                Cập nhật thông tin
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default AccountManagement;
