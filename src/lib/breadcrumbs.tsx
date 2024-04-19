"use client";
import React, { useState } from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";

// Định nghĩa kiểu dữ liệu cho mỗi breadcrumb
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: JSX.Element;
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.primary.contrastText
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
      cursor: "pointer",
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}) as typeof Chip;

interface CustomizedBreadcrumbsProps {
  newBreadcrumbsData: BreadcrumbItem[];
}

export default function CustomizedBreadcrumbs({
  newBreadcrumbsData,
}: CustomizedBreadcrumbsProps) {
  const fontSizeSmall = "small";

  const [breadcrumbsData, setBreadcrumbsData] = useState<BreadcrumbItem[]>([
    {
      label: "Trang chủ",
      href: "/",
      icon: <HomeIcon fontSize={fontSizeSmall} />,
    },
    // Nối newBreadcrumbsData vào mảng breadcrumbsData
    ...(newBreadcrumbsData || []), // Đảm bảo newBreadcrumbsData không bị null/undefined
  ]);

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize={fontSizeSmall} />}
    >
      {breadcrumbsData.map((breadcrumb, index) => (
        <StyledBreadcrumb
          key={index}
          component="a"
          href={breadcrumb.href}
          label={breadcrumb.label}
          icon={breadcrumb.icon}
        />
      ))}
    </Breadcrumbs>
  );
}
