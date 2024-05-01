"use client";
import * as React from "react";
import CustomizedBreadcrumbs from "@/lib/breadcrumbs";
import { Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CustomizedTabs from "@/lib/tabs";
import AccountManagement from "@/components/account/account-management";

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

      <CustomizedTabs
        tabs={[
          { label: "Quản lý tài khoản", content: <AccountManagement /> },
          { label: "Đơn phòng", content: "Item Two" },
          { label: "Khách sạn yêu thích", content: "Item Three" },
        ]}
      />
    </Box>
  );
}
