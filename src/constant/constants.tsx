/**
 * Toast Popup
 */
export const TOAST_KIND: IToastKind = {
  // Success
  SUCCESS: "success",
  SUCCESS_TITLE: "Success",
  SUCCESS_SEVERITY: "success",

  // Error
  ERROR: "error",
  ERROR_TITLE: "Error",
  ERROR_SEVERITY: "error",
};

export const TOAST_MESSAGE: IToastMessage = {
  LOGIN_SUCCESS: "Login Successfully!",
  LOGOUT_SUCCESS: "Logout Successfully!",
  SESSION_TIMEOUT: "Session Timeout!",
  INVALID_USERNAME_PASSWORD: "Invalid username or password!",
  FILTER_ERROR: "Filter Error!",
  SERVER_ERROR: "Server Error!",
};

/**
 * Screen Title
 */
export const SCREEN_TITLE: IScreenTitle = {};

/**
 * Screen API
 */
export const API: IApi = {
  SEARCH: {
    SEARCH_HOTEL: "/hotel/getHotelSearchResults",
  },
  HOTEL: {
    GET_OUTSTANDING_HOTELS: "/hotel/getOutstandingHotels",
    GET_HOTEL_BY_ID: "/hotel/getHotelById",
    GET_HOTEL_DETAIL: "/hotel/:hotel_id/getHotelDetail",
  },
  CUSTOMER: {
    VERIFY_EMAIL: "/customer/verify",
    REGISTER: "/customer/register",
    LOGIN: "/customer/login",
  },
  BOOKING: {
    CREATE_BOOKING: "/booking/createBooking",
  },
  PAYMENT: {
    CREATE_ZALOPAY_PAYMENT_URL: "/payment/zalopay/createPaymentUrl",
  },
  REVIEW: {
    CREATE_REVIEW: "/review/createReview",
  },
};

/**
 * Status code of API Response
 */
export const STATUS_CODE: IStatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * Search + Filter hotel
 */
export const FILTER: IFilter = {
  PRICE: {
    MIN: 0,
    MAX: 5000000,
    STEP: 500000,
  },
  RATING: {
    MIN: 0,
    MAX: 5,
    STEP: 1,
  },
};

export const RATING_CATEGORIES: IRatingCategories = {
  AMAZING: "Tuyệt vời",
  VERY_GOOD: "Rất tốt",
  GOOD: "Tốt",
  SATISFIED: "Hài lòng",
  UNSATISFIED: "Không hài lòng",
};

export const PAYMENT_METHODS: IPaymentMethods = {
  ZALOPAY: "ZALOPAY",
  VNPAY: "VNPAY",
};

export const BOOKING_STATUS: IBookingStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CHECKED_IN: "CHECKED_IN",
  CHECKED_OUT: "CHECKED_OUT",
  CANCELLED: "CANCELLED",
};

export const PAYMENT_STATUS: IPaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
  EXPIRED: "EXPIRED",
};

export const REFUND_STATUS: IRefundStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

export const FALLBACK_URL = {
  HOTEL_NO_IMAGE:
    "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg",
};
