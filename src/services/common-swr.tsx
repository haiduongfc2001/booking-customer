import useSWR from "swr";

const fetcher = async (url: string, fetcherOptions: object = {}) => {
  const defaultOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  const options = {
    ...defaultOptions,
    ...fetcherOptions,
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return await response.json();
};

export default function useCustomAPI(
  endpoint: string,
  fetcherOptions: object = {},
  options: object = {}
) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
  const { data, error, isValidating } = useSWR(
    url,
    () => fetcher(url, fetcherOptions),
    options
  );

  return {
    data,
    error,
    isLoading: !data && !error,
    isValidating,
  };
}
