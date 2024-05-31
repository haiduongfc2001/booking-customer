/**
 * Chuyển đổi các giá trị rating từ chuỗi sang số và tính toán rating trung bình.
 * @param {string[]} ratingData - Mảng chứa các giá trị rating dưới dạng chuỗi.
 * @returns {number} - Trung bình rating.
 */
export function calculateAverageRating(ratingData: string[]): number {
  const ratings: number[] = ratingData.map((item: string) => parseFloat(item));
  const sum: number = ratings.reduce(
    (total: number, rating: number) => total + rating,
    0
  );
  const averageRating: number = sum / ratings.length;

  return averageRating;
}

/**
 * Làm tròn rating trung bình đến 1 chữ số thập phân và chỉ lấy 1 số sau dấu thập phân.
 * @param {number} averageRating - Rating trung bình cần được làm tròn.
 * @returns {number} - Rating trung bình sau khi làm tròn.
 */
export function roundAverageRating(averageRating: number): number {
  const formattedRating: string = averageRating.toFixed(1);
  return parseFloat(formattedRating);
}

/**
 * Chuyển đổi rating từ dạng số thành phần trăm.
 * @param {number} numericRating - Rating dưới dạng số.
 * @returns {number} - Phần trăm rating.
 */
export function convertToPercentage(numericRating: number): number {
  const percentRating: number = isNaN(numericRating) ? 0 : numericRating * 10;
  return percentRating;
}

/**
 * Tính toán và chuyển đổi rating từ chuỗi sang phần trăm.
 * @param {string[]} ratingData - Mảng chứa các giá trị rating dưới dạng chuỗi.
 * @returns {number} - Phần trăm rating.
 */
export function calculateAndConvertToPercentage(ratingData: string[]): number {
  const ratings: number[] = ratingData.map((item: string) => parseFloat(item));
  const sum: number = ratings.reduce(
    (total: number, rating: number) => total + rating,
    0
  );
  const averageRating: number = sum / ratings.length;

  const formattedRating: string = averageRating.toFixed(1);
  const numericRating: number = parseFloat(formattedRating);

  const percentRating: number = isNaN(numericRating) ? 0 : numericRating * 10;

  return percentRating;
}
