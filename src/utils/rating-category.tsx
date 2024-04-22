import { RATING_CATEGORIES } from "@/constant/constants";

export default function ratingCategory(rating: number): string {
  if (typeof rating !== "number" || isNaN(rating)) {
    return "Không hợp lệ";
  }

  if (rating >= 9) {
    return RATING_CATEGORIES.AMAZING;
  } else if (rating >= 8) {
    return RATING_CATEGORIES.VERY_GOOD;
  } else if (rating >= 7) {
    return RATING_CATEGORIES.GOOD;
  } else if (rating >= 6) {
    return RATING_CATEGORIES.SATISFIED;
  } else {
    return RATING_CATEGORIES.UNSATISFIED;
  }
}
