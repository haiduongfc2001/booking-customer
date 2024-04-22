import useSWR from "swr";

export const fetcher = async (url: string) => {
  const response = await fetch(url);

  // Check for errors
  if (!response.ok) {
    throw new Error("API request failed");
  }

  return await response.json();
};

export function useAPI(endpoint: string, options?: any) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  const { data, error, isValidating } = useSWR(url, fetcher, options);

  return {
    data,
    error,
    isLoading: !data && !error,
    isValidating,
  };
}
