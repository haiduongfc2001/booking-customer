import * as React from "react";
import Badge, { BadgeProps } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 16,
    bottom: 16,
    display: "flex",
    padding: "0 6px",
    zIndex: 1,
    position: "absolute",
    flexWrap: "wrap",
    fontSize: "0.8571428571428571rem",
    boxSizing: "border-box",
    transition: "transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    alignItems: "center",
    fontWeight: 500,
    lineHeight: 1,
    alignContent: "center",
    borderRadius: "10px",
    flexRirection: "row",
    justifyContent: "center",
  },
  "& .MuiBadge-anchorOriginBottomRightCircle": {
    transform: "scale(1) translate(50%, 50%)",
    transformOrigin: "100% 100%",
  },
}));

interface BadgesProps {
  children?: React.ReactNode;
  badgeContent?: React.ReactNode;
}

export default function CustomizedBadges(props: BadgesProps) {
  const { children, badgeContent } = props;

  return (
    <StyledBadge
      badgeContent={badgeContent}
      color="default"
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      {children}
    </StyledBadge>
  );
}
