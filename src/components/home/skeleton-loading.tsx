"use client";

import { Box, Skeleton, Typography } from "@mui/material";

interface ISkeletonLoadingProps {
  itemsPerPage?: number;
}

const SkeletonLoading: React.FC<ISkeletonLoadingProps> = ({
  itemsPerPage = 4,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff5f7",
        minHeight: "300px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          px: 5,
          pt: 3,
          pb: 2,
        }}
      >
        Khách sạn nổi bật
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "stretch",
          padding: "0 24px 24px",
          gap: "16px",
        }}
      >
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <Box
            key={index}
            sx={{
              width: `calc(100% / ${itemsPerPage})`,
              mx: "16px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Skeleton
              variant="rectangular"
              sx={{
                width: "100% !important",
                height: "150px !important",
                borderRadius: "8px 8px 0 0 !important",
              }}
            />
            <Box p={2} sx={{ flexGrow: 1, width: "100%" }}>
              <Typography component="div" variant="h4">
                <Skeleton />
              </Typography>
              <Skeleton />
            </Box>
            <Box
              p={2}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Skeleton sx={{ alignSelf: "flex-end", width: "40%" }} />
              <Skeleton sx={{ alignSelf: "flex-end", width: "50%" }} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SkeletonLoading;
