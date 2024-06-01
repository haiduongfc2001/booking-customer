import React from "react";
import { Box, Typography } from "@mui/material";
import formatCurrency from "@/utils/format-currency";

interface Booking {
  numRooms: number;
  checkIn: string;
  totalRoomPrice: number;
  basePrice: number;
  totalPrice: number;
}

interface Rate {
  priceDetail: {
    occupancies: {
      totalTaxAndServiceFee: number;
    }[];
  };
}

interface RoomInfo {
  rates: Rate[];
}

interface RoomPricingProps {
  numNights: number;
  booking: Booking;
  roomInfo: RoomInfo;
}

const formatDate = (dateString: string, index: number): string => {
  const [day, month, year] = dateString.split("-");
  const currentDate = new Date(`${year}-${month}-${day}`);
  currentDate.setDate(currentDate.getDate() + index);
  const formattedDay = currentDate.getDate();
  const formattedMonth = currentDate.getMonth() + 1;
  return `${formattedDay}/${formattedMonth}`;
};

const RoomPricing: React.FC<RoomPricingProps> = ({
  numNights,
  booking,
  roomInfo,
}) => {
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
            Giá cho {numNights} đêm x {booking.numRooms} phòng
          </Typography>
          <Typography>{formatCurrency(booking.totalRoomPrice)}</Typography>
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
          {Array.from({ length: numNights }, (_, index) => (
            <Box
              key={index}
              sx={{
                px: 2,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2">
                Đêm {index + 1} ({formatDate(booking.checkIn, index)}) x{" "}
                {booking.numRooms} phòng
              </Typography>
              <Typography variant="body2">
                {formatCurrency(booking.numRooms * booking.basePrice)}
              </Typography>
            </Box>
          ))}
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
          <Typography>
            {formatCurrency(
              roomInfo.rates[0].priceDetail.occupancies[0]
                .totalTaxAndServiceFee * numNights
            )}
          </Typography>
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
              Giá cho {numNights} đêm, {booking.numRooms} phòng
            </Typography>
          </Box>
          <Typography>{formatCurrency(booking.totalPrice)}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RoomPricing;
