// Error handling function with type safety
export const extractErrorInfo = (error: any): ErrorInfo => {
  // Assuming error object has response property with specific structure
  if (!error.response) {
    return { message: "Unknown error occurred!" }; // Handle non-API errors
  }

  const { data, status, headers } = error.response; // Destructuring for clarity
  return {
    message: data?.message || "API error", // Extract error message from response data (if available)
    status,
    headers,
  };
};

// Define the ErrorInfo interface (optional, adjust based on your API error structure)
interface ErrorInfo {
  message: string;
  status?: number; // Optional status code
  headers?: Record<string, string>; // Optional response headers
}
