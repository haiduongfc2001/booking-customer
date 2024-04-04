"use client";
// import MapComponent from "@/components/map/map";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { Box, Button, CardMedia, Grid, TextField } from "@mui/material";
import { Metadata } from "next";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SearchIcon from "@mui/icons-material/Search";

const metadata: Metadata = {
  title: "DHD | Home",
  description: "The official Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function Home() {
  const [checkInDate, setCheckInDate] = React.useState<Dayjs | null>(dayjs());
  const [checkOutDate, setCheckOutDate] = React.useState<Dayjs | null>(dayjs());

  const handleCheckInChange = (newValue: Dayjs | null) => {
    setCheckInDate(newValue);
    // Nếu ngày đến (check-in) lớn hơn ngày về (check-out), cập nhật ngày về (check-out) thành ngày đến (check-in)
    if (newValue && checkOutDate && newValue.isAfter(checkOutDate)) {
      setCheckOutDate(newValue);
    }
  };

  const handleCheckOutChange = (newValue: Dayjs | null) => {
    // Nếu ngày về (check-out) nhỏ hơn ngày đến (check-in), không thực hiện gì cả
    if (!checkInDate || (newValue && newValue.isBefore(checkInDate))) {
      return;
    }
    setCheckOutDate(newValue);
  };

  return (
    <>
      <Box
        sx={{
          color: "#1a202c",
          height: "460px",
          position: "relative",
          fontSize: "14px",
          fontWeight: "normal",
          lineHeight: "17px",
        }}
      >
        <CardMedia
          component="img"
          src="https://www.usatoday.com/gcdn/-mm-/05b227ad5b8ad4e9dcb53af4f31d7fbdb7fa901b/c=0-64-2119-1259/local/-/media/USATODAY/USATODAY/2014/08/13/1407953244000-177513283.jpg"
          alt="hotel"
          sx={{
            width: "100%",
            height: 460,
            objectFit: "cover",
            mb: 2,
            mr: 2,
          }}
        />
        <Box
          sx={{
            cursor: "default",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            p: "8px 24px",
            mt: "calc(230px - 27px)",
            borderBottom: "none",
            bgcolor: "inherit",
            display: "flex",
            position: "absolute",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              m: "0 auto",
              maxWidth: "1188px",
              boxShadow: "0px 12px 12px 0px rgba(0, 0, 0, 0.10)",
              // minHeight: "112px",
              borderRadius: "8px",
              bgcolor: "#f8f7f9",
            }}
          >
            <div style={{ width: "100%" }}>
              <div
                style={{
                  border: "4px solid #ffb700",
                  boxShadow: "0 2px 8px 0 rgba(26, 26, 26, 0.16)",
                  borderRadius: "8px",
                  padding: "4px",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={2.5}>
                    <TextField
                      fullWidth
                      required
                      label="Địa điểm"
                      placeholder="Bạn muốn đến đâu?"
                      name="address"
                      type="text"
                      sx={{
                        "& .MuiInputBase-input": {
                          bgcolor: "background.paper",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2.5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Ngày đến"
                        value={checkInDate}
                        onChange={handleCheckInChange}
                        minDate={checkInDate ? checkInDate : dayjs()}
                        sx={{ bgcolor: "background.paper", width: "100%" }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.5}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Ngày về"
                        value={checkOutDate}
                        onChange={handleCheckOutChange}
                        minDate={checkInDate ? checkInDate : dayjs()}
                        sx={{ bgcolor: "background.paper", width: "100%" }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={2.5}>
                    <TextField
                      fullWidth
                      required
                      label="Số phòng, số khách"
                      name="address"
                      type="text"
                      sx={{
                        "& .MuiInputBase-input": {
                          bgcolor: "background.paper",
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        width: "100%",
                        minHeight: "32px",
                        textTransform: "uppercase",
                      }}
                      startIcon={<SearchIcon />}
                      aria-label="find room"
                    >
                      Tìm
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Box>
        </Box>
      </Box>
      {/* <MapComponent /> */}
    </>
  );
}
