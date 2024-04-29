export const getInitials = (name: string | null = ""): string =>
  // Nếu name là null, trả về "A"
  name === null
    ? "A"
    : name
        .replace(/\s+/, " ")
        .split(" ")
        .slice(0, 2)
        .map((v) => v && v[0].toUpperCase())
        .join("");
