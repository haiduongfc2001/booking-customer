import { BOOKING_STATUS, PAYMENT_STATUS } from "@/constant/constants";

// Hàm để xác định màu sắc dựa trên trạng thái của booking
export const getBookingStatusColor = (status: string) => {
  switch (status) {
    case BOOKING_STATUS.PENDING:
      return "warning";
    case BOOKING_STATUS.CONFIRMED:
      return "success";
    case BOOKING_STATUS.CHECKED_IN:
      return "primary";
    case BOOKING_STATUS.CHECKED_OUT:
      return "secondary";
    case BOOKING_STATUS.CANCELLED:
      return "error";
    default:
      return "default";
  }
};

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case PAYMENT_STATUS.PENDING:
      return "warning";
    case PAYMENT_STATUS.COMPLETED:
      return "success";
    case PAYMENT_STATUS.FAILED:
      return "error";
    case PAYMENT_STATUS.CANCELLED:
      return "error";
    case PAYMENT_STATUS.REFUNDED:
      return "info";
    case PAYMENT_STATUS.EXPIRED:
      return "default";
    default:
      return "default";
  }
};
