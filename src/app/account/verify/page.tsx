"use client";
import { useRouter } from "next/navigation";
import { Box, Link, Typography } from "@mui/material";
import React from "react";
import { API } from "@/constant/constants";
import CustomizedSnackbars from "@/lib/snackbar";
import useCustomAPI from "@/lib/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NextLink from "next/link";

export default function VerifyAccount() {
  const router = useRouter();

  const customer_id = new URLSearchParams(window.location.search).get("id");
  const { data, error } = useCustomAPI(
    `${API.CUSTOMER.VERIFY_EMAIL}?id=${customer_id}`,
    { method: "POST" }
  );

  React.useEffect(() => {
    if (data) {
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 200);
      return () => clearTimeout(timeout);
    } else {
      console.log(error);
    }
  }, [data, error, router]);

  return (
    <div>
      <>
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
              maxWidth: 650,
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
              {data && (
                <>
                  <CustomizedSnackbars message={data.message} />
                  <Typography variant="h4" color="primary">
                    {data.message}
                  </Typography>
                </>
              )}

              {!customer_id && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: "20px",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="flex-start"
                    mb={3}
                  >
                    <CheckCircleIcon
                      color="success"
                      sx={{
                        fontSize: 32,
                        mr: 2,
                      }}
                    />
                    <Typography variant="h4" color="primary">
                      Đăng ký tài khoản thành công!
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="#333333" sx={{ mb: 3 }}>
                    Xin vui lòng xác thực email trong tin nhắn được chúng tôi
                    gửi trong email của bạn!
                  </Typography>
                  <Typography color="text.secondary" variant="body1">
                    Bạn đã có tài khoản? &nbsp;
                    <Link
                      component={NextLink}
                      href="/login"
                      underline="hover"
                      variant="h6"
                    >
                      Đăng nhập
                    </Link>
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </>
    </div>
  );
}
