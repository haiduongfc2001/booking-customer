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
    SEARCH_HOTEL: "SearchHotel",
  },
  HOTEL: {
    GET_OUTSTANDING_HOTELS: "/hotel/getOutstandingHotels",
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
