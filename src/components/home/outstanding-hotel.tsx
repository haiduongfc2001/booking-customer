"use client";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { Typography, Box, CardMedia, Stack, useTheme } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import useMediaQuery from "@mui/material/useMediaQuery";
import formatCurrency from "@/utils/format-currency";
import { useAPI } from "@/lib/api";

const OutstandingHotel: React.FC = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));
  const isSm = useMediaQuery(theme.breakpoints.only("sm"));
  const isMd = useMediaQuery(theme.breakpoints.only("md"));
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));

  const {
    data: outstandingHotels,
    error,
    isLoading,
  } = useAPI("/hotel/getOutstandingHotels");

  if (error) {
    return <p>Failed to fetch</p>;
  }

  if (isLoading) {
    if (isLoading) return <div>Loading...</div>;
  }

  const itemsPerPage = isLgUp ? 4 : isMd ? 3 : isSm ? 2 : isXs ? 1 : 4;

  const groupedItems = [];
  for (let i = 0; i < outstandingHotels.data.length; i += itemsPerPage) {
    groupedItems.push(outstandingHotels.data.slice(i, i + itemsPerPage));
  }

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
      <Carousel
        NextIcon={<KeyboardArrowRightIcon />}
        PrevIcon={<KeyboardArrowLeftIcon />}
        fullHeightHover={false}
        navButtonsProps={{
          style: {
            background: "white",
            color: "black",
            zIndex: 2,
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 8px 12px",
            opacity: 1,
          },
        }}
        autoPlay={false}
        stopAutoPlayOnHover={true}
        animation="slide"
        duration={500}
        // indicators={false}
        sx={{
          "& .MuiButtonBase-root": {
            opacity: 1,
            transition: "opacity 0.2s ease",
          },
          "& svg:hover": {
            color: "#00B6F3",
            transition: "color 0.2s ease",
          },
        }}
      >
        {groupedItems.map((group, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "stretch",
              padding: "0 24px 24px",
              gap: "16px",
            }}
          >
            {group.map((item: IOutstandingHotels, itemIndex: number) => (
              <Box
                key={itemIndex}
                sx={{
                  width: `calc(100% / ${itemsPerPage})`,
                  mx: "16px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
                  bgcolor: "background.paper",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.3)",
                    transform: "scale(1.02)",
                    transition:
                      "box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out",
                    cursor: "pointer",
                    bgcolor: "rgba(255, 255, 255, 0.95)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  src={
                    item?.hotel_avatar ||
                    "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                  }
                  alt={item.hotel_name}
                  sx={{
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px 8px 0 0",
                  }}
                />
                <Box p={2} sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {item.hotel_name}
                  </Typography>
                  <Stack direction="row">
                    <LocationOnIcon />
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        display: "-webkit-box",
                        "-webkit-line-clamp": 2,
                        "-webkit-box-orient": "vertical",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.hotel_address}
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  p={2}
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box></Box>{" "}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#718096",
                          textDecoration: "line-through",
                          cursor: "pointer",
                        }}
                        component="span"
                      >
                        {formatCurrency(item.original_room_price)}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "rgb(229, 62, 62)",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                        component="span"
                      >
                        {formatCurrency(item.min_room_price)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        ))}
      </Carousel>
    </Box>
  );
};

export default OutstandingHotel;
