"use client";
import * as React from "react";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import { Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CustomizedTabs from "@/lib/tabs";
import AccountManagement from "@/components/account/account-management";
import HotelIcon from "@mui/icons-material/Hotel";
import FavoriteHotels from "@/components/account/favorite-hotels";
import MyBookings from "@/components/account/my-bookings";
import { tabs } from "../page";

export default function FavoriteHotel(props: any) {
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
          {
            label: "Khách sạn yêu thích",
            icon: <HotelIcon />,
          },
        ]}
      />

      <CustomizedTabs tabs={tabs} />
    </Box>
  );
}
