/**
 * Toast Popup
 */
interface IToastKind {
  [key: string]: string;
}

interface IToastMessage {
  [key: string]: string;
}

/**
 * Screen Title
 */
interface IScreenTitle {
  [key: string]: string;
}

/**
 * API
 */
interface IApi {
  SEARCH: { [key: string]: string };
  HOTEL: { [key: string]: string };
  CUSTOMER: { [key: string]: string };
  BOOKING: { [key: string]: string };
  PAYMENT: { [key: string]: string };
  REVIEW: { [key: string]: string };
}

/**
 * Status code of API Response
 */
interface IStatusCode {
  [key: string]: number;
}

/**
 * Search + Filter hotel
 */
interface IFilterHotel {
  [key: string]: number;
}

interface IFilter {
  PRICE: IFilterHotel;
  RATING: IFilterHotel;
}

interface IRatingCategories {
  [key: string]: string;
}

interface ISnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning" | undefined;
}

interface IPaymentMethods {
  [key: string]: string;
}

interface IBookingStatus {
  [key: string]: string;
}

interface IPaymentStatus {
  [key: string]: string;
}

interface IRefundStatus {
  [key: string]: string;
}

interface TabInfo {
  id: number;
  href: string;
  label: string;
  content: React.ReactNode;
}
