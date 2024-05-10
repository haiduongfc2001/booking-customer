"use client";
import * as React from "react";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import { Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CustomizedTabs from "@/lib/tabs";
import AccountManagement from "@/components/account/account-management";
import FavoriteHotels from "@/components/account/favorite-hotels";
import MyBookings from "@/components/account/my-bookings";

export const tabs = [
  {
    href: "/account",
    label: "Quản lý tài khoản",
    content: <AccountManagement />,
  },
  { href: "/account/my-booking", label: "Đơn phòng", content: <MyBookings /> },
  {
    href: "/account/favorite-hotel",
    label: "Khách sạn yêu thích",
    content: <FavoriteHotels />,
  },
];

export default function UserAccount(props: any) {
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
            label: "Tài khoản",
            icon: <AccountCircleIcon />,
          },
        ]}
      />

      <CustomizedTabs tabs={tabs} />
    </Box>
  );
}
