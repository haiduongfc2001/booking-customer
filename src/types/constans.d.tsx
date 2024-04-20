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
