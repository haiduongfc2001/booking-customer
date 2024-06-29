import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  Box,
  Icon,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Grid,
  Theme,
  DialogProps,
  CardMedia,
} from "@mui/material";
import AccessAlarmsIcon from "@mui/icons-material/AccessAlarms";
import { useRouter } from "next/navigation";

interface TimeLeft {
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  theme: Theme;
  scrollY: number;
  hotelId: number;
  searchQueryParams: string;
  expiresAt: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  theme,
  scrollY,
  hotelId,
  searchQueryParams,
  expiresAt,
}) => {
  const router = useRouter();

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(expiresAt) - +new Date();
    let timeLeft: TimeLeft = { minutes: 10, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor(difference / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);

      if (updatedTimeLeft.minutes === 0 && updatedTimeLeft.seconds === 0) {
        setOpenDialog(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  const handleDialogClose: DialogProps["onClose"] = (event, reason) => {
    if (reason && reason === "backdropClick") return;
    setOpenDialog(false);
  };

  const handleOtherBooking: MouseEventHandler<HTMLButtonElement> = () => {
    router.push(`/hotel/${hotelId}?${searchQueryParams}`);
  };

  const handleBookingContinue: MouseEventHandler<HTMLButtonElement> = () => {
    window.location.reload();
  };

  return (
    <Grid container spacing={3} my={3}>
      <Grid
        item
        xs={12}
        sx={{
          top: scrollY > 64 ? 0 : 64 - scrollY,
          right: 0,
          left: 0,
          position: "fixed",
          zIndex: 10,
          p: "0 !important",
          transition: theme.transitions.create("top", {
            duration: theme.transitions.duration.short,
          }),
        }}
      >
        <Box
          sx={{
            bgcolor: "#ffbd38",
            p: 1,
            mb: 2,
            borderRadius: 1,
          }}
        >
          <Box>
            {timeLeft.minutes !== 0 || timeLeft.seconds !== 0 ? (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Icon sx={{ mx: 2 }}>
                  <AccessAlarmsIcon />
                </Icon>
                <Typography variant="body1" mr={1}>
                  Thời gian hoàn tất thanh toán
                </Typography>
                <Typography variant="body1" color="primary" fontWeight="bold">
                  {timeLeft.minutes < 10
                    ? `0${timeLeft.minutes}`
                    : timeLeft.minutes}
                  :
                  {timeLeft.seconds < 10
                    ? `0${timeLeft.seconds}`
                    : timeLeft.seconds}
                </Typography>
              </Box>
            ) : (
              <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                  sx: {
                    width: "60%",
                    // height: "85%",
                    display: "flex",
                    p: "24px 12px 12px 12px",
                    alignItems: "center",
                    flexDirection: "column",
                  },
                }}
              >
                <DialogTitle id="alert-dialog-title">
                  <CardMedia
                    component="img"
                    src={"/images/alarm-clock.png"}
                    alt={"bookin-time-is-up"}
                    sx={{
                      height: "250px",
                      objectFit: "contain",
                      borderRadius: 1,
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      mt: "24px",
                      px: "12px",
                      fontSize: "18px",
                      textAlign: "center",
                      fontWeight: 600,
                      lineHeight: "21px",
                    }}
                  >
                    Thời gian hoàn tất thanh toán đã hết!
                  </Typography>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText
                    id="alert-dialog-description"
                    sx={{
                      p: "0 12px",
                      fontSize: "14px",
                      textAlign: "center",
                      lineHeight: "22px",
                    }}
                  >
                    Bạn có muốn tiếp tục đặt phòng này? Giá có thể sẽ tăng nếu
                    bạn rời đi bây giờ.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                    }}
                  >
                    <Button
                      onClick={handleOtherBooking}
                      color="inherit"
                      variant="contained"
                      sx={{ margin: "0px 12px 12px" }}
                    >
                      Chọn phòng khác
                    </Button>

                    <Button
                      onClick={handleBookingContinue}
                      color="primary"
                      variant="contained"
                      sx={{ margin: "0px 12px 12px" }}
                    >
                      Tiếp tục đặt phòng
                    </Button>
                  </Box>
                </DialogActions>
              </Dialog>
            )}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
