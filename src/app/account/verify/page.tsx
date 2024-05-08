"use client";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import React from "react";
import { useAPI } from "@/lib/api";
import { API } from "@/constant/constants";
import CustomizedSnackbars from "@/lib/snackbar";

const VerifyAccount = () => {
  const router = useRouter();

  const customer_id = new URLSearchParams(window.location.search).get("id");
  const { data, error } = useAPI(
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
      {data && (
        <>
          <CustomizedSnackbars message={data.message} />
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
                <Typography variant="h4" color="primary">
                  {data.message}
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

export default VerifyAccount;
