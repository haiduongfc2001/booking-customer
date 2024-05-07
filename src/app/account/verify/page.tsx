"use client";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Box, Link, Typography } from "@mui/material";
import React from "react";
import axios from "axios";

const VerifyAccount = () => {
  const router = useRouter();

  React.useEffect(() => {
    const customer_id = new URLSearchParams(window.location.search).get("id");
    axios
      .post(
        `http://localhost:5000/api/v1/customer/verify?id=${customer_id}`,
        {}
      )
      .then((response) => {
        const timeout = setTimeout(() => {
          router.push("/login");
        }, 200);

        return () => clearTimeout(timeout);
      })
      .catch((error) => {
        console.log(error);
      });
  });

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
          <Typography variant="h6" color="primary">
            Xác thực tài khoản thành công!
          </Typography>
          <Link
            component={NextLink}
            href="/login"
            underline="hover"
            variant="subtitle2"
          >
            Đăng nhập
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default VerifyAccount;
