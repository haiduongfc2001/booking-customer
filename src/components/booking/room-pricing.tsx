import React from "react";
import { Box, Typography } from "@mui/material";
import formatCurrency from "@/utils/format-currency";

interface Booking {
  [key: string]: any;
}

interface Rate {
  [key: string]: any;
}

interface RoomInfo {
  rates: Rate[];
}

interface RoomPricingProps {
  numNights: number;
  booking: Booking;
  roomInfo: RoomInfo;
}

const RoomPricing: React.FC<RoomPricingProps> = ({
  numNights,
  booking,
  roomInfo,
}) => {
  const total_service_fee_and_tax = Math.floor(
    Number(booking?.cost?.total_service_fee + booking?.cost?.total_tax)
  );

  return (
    <Box sx={{ bgcolor: "neutral.200", p: 2, mb: 2, borderRadius: 1 }}>
      <Typography variant="h6" mb={2}>
        Chi tiết giá
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
          }}
        >
          <Typography>
            Giá cho {numNights} đêm x {booking?.num_rooms} phòng
          </Typography>
          <Typography>{formatCurrency(booking?.total_room_price)}</Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            bgcolor: "primary.lightest",
            color: "black",
            mx: 2,
            px: 2,
            py: 1,
            borderRadius: 1,
          }}
        >
          {Array.from({ length: numNights }, (_, index) => {
            const currentDate = new Date(booking?.check_in);
            currentDate.setDate(currentDate.getDate() + index);
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;

            return (
              <Box
                key={index}
                sx={{
                  pl: 2,
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">
                  Đêm {index + 1} ({day}/{month}) x {booking?.num_rooms} phòng
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(
                    booking?.num_rooms * booking?.cost?.total_room_price
                  )}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
          }}
        >
          <Typography>Thuế và phí dịch vụ khách sạn</Typography>
          <Typography>{formatCurrency(total_service_fee_and_tax)}</Typography>
        </Box>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            pt: 2,
            borderTop: "2px solid gray",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6">Tổng tiền thanh toán</Typography>
            <Typography variant="subtitle2">
              Đã bao gồm thuế, phí, VAT
            </Typography>
            <Typography variant="subtitle2">
              Giá cho {numNights} đêm, {booking?.num_rooms} phòng
            </Typography>
          </Box>
          <Typography variant="h6">
            {formatCurrency(booking?.cost?.final_price)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RoomPricing;
