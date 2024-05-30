import useSWR from "swr";

const fetcher = async (
  url: string,
  fetcherOptions: {
    body?: object;
    token?: string;
    method?: string;
    [key: string]: any;
  } = {}
) => {
  const { method = "GET", body, token, ...restOptions } = fetcherOptions;

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  let finalUrl = url;
  if (method === "GET" && body) {
    const queryParams = new URLSearchParams(
      body as Record<string, string>
    ).toString();
    finalUrl = `${url}?${queryParams}`;
  }

  const options: RequestInit = {
    method,
    headers: defaultHeaders,
    ...restOptions,
    ...(method !== "GET" && body && { body: JSON.stringify(body) }),
  };

  const response = await fetch(finalUrl, options);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return await response.json();
};

export default function useCustomAPI(
  endpoint: string,
  fetcherOptions: {
    body?: object;
    token?: string;
    method?: string;
    [key: string]: any;
  } = {},
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
