"use client";
import * as React from "react";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import { Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CustomizedTabs from "@/lib/tabs";
import HotelIcon from "@mui/icons-material/Hotel";
import { tabs } from "../page";

export default function MyBooking(props: any) {
  return (
    <Box
      sx={{
        mx: 10,
        my: 4,
      }}
    >
      <CustomizedBreadcrumbs
        newBreadcrumbsData={[
          {
            href: "/account",
            label: "Tài khoản",
            icon: <AccountCircleIcon />,
          },
          {
            label: "Đơn đặt phòng",
            icon: <HotelIcon />,
          },
        ]}
      />

      <CustomizedTabs tabs={tabs} />
    </Box>
  );
}
