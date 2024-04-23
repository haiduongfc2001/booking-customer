"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { ReactNode } from "react";
import { Fade } from "@mui/material";

interface CustomizedTooltipProps {
  title: ReactNode;
  content: ReactNode;
  maxWidth?: number; // Thêm một thuộc tính optional cho maxWidth
}

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme, maxWidth }: { theme: any; maxWidth?: number }) => {
  const { palette } = theme;
  const tooltipBackgroundColor =
    palette.mode === "dark" ? palette.common.white : palette.common.black;
  const tooltipColor =
    palette.mode === "dark" ? palette.common.black : palette.common.white;
  const arrowBackgroundColor = tooltipBackgroundColor;

  return {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: tooltipBackgroundColor,
      color: tooltipColor,
      boxShadow: theme.shadows[1],
      fontSize: 12,
      maxWidth: maxWidth || 500,
    },
    [`& .MuiTooltip-arrow:before`]: {
      backgroundColor: arrowBackgroundColor,
    },
  };
});

const CustomizedTooltip: React.FC<CustomizedTooltipProps> = ({
  title,
  content,
}) => {
  return (
    <StyledTooltip
      arrow
      disableInteractive
      title={title}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 300 }}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -10],
              },
            },
          ],
        },
      }}
    >
      <div>{content}</div>
    </StyledTooltip>
  );
};

export default CustomizedTooltip;
