"use client";
import { useRouter } from "next/navigation";
import { Box, Link, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { API } from "@/constant/constants";
import CustomizedSnackbars from "@/lib/snackbar";
import useCustomAPI from "@/services/common-swr";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NextLink from "next/link";

export default function VerifyAccount() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = new URLSearchParams(window.location.search).get("id");
      setCustomerId(id);
    }
  }, []);

  const { data, error } = useCustomAPI(
    customerId ? `${API.CUSTOMER.VERIFY_EMAIL}?id=${customerId}` : "",
    { method: "POST" }
  );

  useEffect(() => {
    if (data) {
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 200);
      return () => clearTimeout(timeout);
    } else if (error) {
      console.log(error);
    }
  }, [data, error, router]);

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        backgroundImage:
          "url('https://r4.wallpaperflare.com/wallpaper/282/810/421/ocean-summer-summertime-hotel-wallpaper-0930282db19afdabf6d7485f2031463d.jpg')",
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

          {!customerId && (
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
                Xin vui lòng xác thực email trong tin nhắn được chúng tôi gửi
                trong email của bạn!
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
  );
}
