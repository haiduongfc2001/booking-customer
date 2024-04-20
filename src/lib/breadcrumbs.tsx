"use client";
import React from "react";
import { emphasize, styled } from "@mui/material/styles";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";
import { borderColor } from "@mui/system";

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
  const colorHover =
    theme.palette.mode === "light"
      ? theme.palette.primary.main
      : theme.palette.primary.contrastText;
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      color: colorHover,
      transition: "color 0.2s ease",
      backgroundColor: emphasize(backgroundColor, 0.12),
      cursor: "pointer",
      "& .MuiSvgIcon-root": {
        color: colorHover,
        transition: "color 0.2s ease",
      },
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

  const breadcrumbsData = [
    {
      label: "Trang chủ",
      href: "/",
      icon: <HomeIcon fontSize={fontSizeSmall} />,
    },
    // Nối newBreadcrumbsData vào mảng breadcrumbsData
    ...(newBreadcrumbsData || []), // Đảm bảo newBreadcrumbsData không bị null/undefined
  ];

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize={fontSizeSmall} />}
    >
      {breadcrumbsData.map((breadcrumb, index) =>
        breadcrumb.href ? (
          <Link key={index} href={breadcrumb.href}>
            <StyledBreadcrumb
              label={breadcrumb.label}
              icon={breadcrumb.icon}
              component="span"
            />
          </Link>
        ) : (
          <StyledBreadcrumb
            key={index}
            label={breadcrumb.label}
            icon={breadcrumb.icon}
            component="span"
          />
        )
      )}
    </Breadcrumbs>
  );
}
