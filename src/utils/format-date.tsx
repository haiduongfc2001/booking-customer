export const formatDate = (date: Date | number = new Date()) => {
  if (typeof date === "number") {
    const dateInpuit = new Date(date);
    const day = dateInpuit.getDate();
    const month = dateInpuit.getMonth() + 1; // Months are zero-indexed, so we add 1
    const year = dateInpuit.getFullYear();

    // Padding single digits with leading zeros
    const formattedDay = day < 10 ? "0" + day : day;
    const formattedMonth = month < 10 ? "0" + month : month;

    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

    return formattedDate;
  }

  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và thêm 0 phía trước nếu cần
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng và thêm 0 phía trước nếu cần
  const year = date.getFullYear(); // Lấy năm

  return `${day}-${month}-${year}`; // Trả về chuỗi đã định dạng
};
