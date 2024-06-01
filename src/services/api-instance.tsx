import axios from "axios";
import { extractErrorInfo } from "../utils/extract-error-info"; // Assuming this handles error extraction

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
}

const commonService = axios.create({
  baseURL,
});

interface CommonServiceResponse {
  token?: string; // Include possible response properties
  message?: string;
  data?: any;
  [key: string]: any;
}

interface ErrorInfo {
  message: string;
  [key: string]: any;
}

interface RequestOptions {
  params?: Record<string, any>; // Optional query parameters
  headers?: { [key: string]: string }; // Optional custom headers
  data?: any; // Optional data for DELETE requests
}

// Utility function to get authorization headers
const getAuthHeaders = (): { Authorization: string } => {
  // const accessToken = getAccessToken();
  // if (!accessToken) {
  //   throw new Error("Access token is null");
  // }
  return {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImVtYWlsIjoiaGFpZHVvbmd0YjIwMDFAZ21haWwuY29tIiwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzE3MjYyMTI0fQ.CzSl-0WKC7EUBPnEpFntfobA1S-WCig__oJB0--0HkA`,
  };
};

export const get = async (
  path: string,
  options?: RequestOptions
): Promise<CommonServiceResponse> => {
  const response = await commonService.get(path, options);
  return response.data;
};

export const post = async (
  path: string,
  data: any,
  options?: RequestOptions
): Promise<CommonServiceResponse> => {
  const response = await commonService.post(path, data, options);
  return response.data;
};

export const patch = async (
  path: string,
  data: any,
  options?: RequestOptions
): Promise<CommonServiceResponse> => {
  const response = await commonService.patch(path, data, options);
  return response.data;
};

export const put = async (
  path: string,
  data: any,
  options?: RequestOptions
): Promise<CommonServiceResponse> => {
  const response = await commonService.put(path, data, options);
  return response.data;
};

export const _delete = async (
  path: string,
  options?: RequestOptions
): Promise<CommonServiceResponse> => {
  const response = await commonService.delete(path, options);
  return response.data;
};

const handleRequest = async (
  method: "get" | "post" | "patch" | "put" | "delete",
  endpoint: string,
  data?: any
): Promise<CommonServiceResponse | ErrorInfo> => {
  try {
    const options: RequestOptions = {
      headers: getAuthHeaders(),
    };

    if (method === "get" || method === "delete") {
      delete options.data;
    }

    let res;
    switch (method) {
      case "get":
        res = await get(endpoint, options);
        break;
      case "post":
        res = await post(endpoint, data, options);
        break;
      case "patch":
        res = await patch(endpoint, data, options);
        break;
      case "put":
        res = await put(endpoint, data, options);
        break;
      case "delete":
        res = await _delete(endpoint, options);
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
    return res;
  } catch (error) {
    return extractErrorInfo(error);
  }
};

export const getRequest = (
  endpoint: string
): Promise<CommonServiceResponse | ErrorInfo> => {
  return handleRequest("get", endpoint);
};

export const postRequest = (
  endpoint: string,
  data: any
): Promise<CommonServiceResponse | ErrorInfo> => {
  return handleRequest("post", endpoint, data);
};

export const patchRequest = (
  endpoint: string,
  data: any
): Promise<CommonServiceResponse | ErrorInfo> => {
  return handleRequest("patch", endpoint, data);
};

export const putRequest = (
  endpoint: string,
  data: any
): Promise<CommonServiceResponse | ErrorInfo> => {
  return handleRequest("put", endpoint, data);
};

export const deleteRequest = (
  endpoint: string,
  data?: any
): Promise<CommonServiceResponse | ErrorInfo> => {
  return handleRequest("delete", endpoint, data);
};
