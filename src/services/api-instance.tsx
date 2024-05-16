// api-instance.tsx

import axios from "axios";
import { extractErrorInfo } from "../utils/extract-error-info"; // Assuming this handles error extraction
import { getAccessToken } from "./storage";
import { DecryptToken } from "../utils/token-handler"; // Assuming this handles token decryption

// Environment variable for base URL (replace with your actual value)
declare const REACT_APP_BASE_URL: string;

const commonService = axios.create({
  baseURL: REACT_APP_BASE_URL,
});

// Enforce type safety for request parameters and responses
interface CommonServiceResponse {}

interface RequestOptions {
  params?: Record<string, any>; // Optional query parameters
  headers?: { [key: string]: string }; // Optional custom headers
  data?: any; // Optional data for DELETE requests
}

// Utility function to get authorization headers
const getAuthHeaders = (): { Authorization: string } => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new Error("Access token is null");
  }
  return {
    Authorization: `Bearer ${DecryptToken(accessToken)}`,
  };
};

// Base GET method with type safety
export const get = async (
  path: string,
  options?: RequestOptions
): Promise<CommonServiceResponse> => {
  const response = await commonService.get(path, options);
  return response.data;
};

// Base POST method with type safety
export const post = async (
  path: string,
  data: any,
  options?: RequestOptions
): Promise<CommonServiceResponse> => {
  const response = await commonService.post(path, data, options);
  return response.data;
};

// Base PATCH method with type safety
export const patch = async (
  path: string,
  data: any,
  options?: RequestOptions
): Promise<CommonServiceResponse> => {
  const response = await commonService.patch(path, data, options);
  return response.data;
};

// Base PUT method with type safety
export const put = async (
  path: string,
  data: any,
  options?: RequestOptions
): Promise<CommonServiceResponse> => {
  const response = await commonService.put(path, data, options);
  return response.data;
};

// Base DELETE method with type safety
export const _delete = async (
  path: string,
  options?: RequestOptions
): Promise<CommonServiceResponse> => {
  const response = await commonService.delete(path, options);
  return response.data;
};

// Common request handler with error handling and type safety
const handleRequest = async (
  method: "get" | "post" | "patch" | "put" | "delete",
  endpoint: string,
  data?: any
): Promise<CommonServiceResponse | ErrorInfo> => {
  try {
    const options: RequestOptions = {
      headers: getAuthHeaders(),
    };

    if (data) {
      options.data = data;
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
    }
    return res;
  } catch (error) {
    return extractErrorInfo(error);
  }
};

// Common request methods
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

// Optional: Define an ErrorInfo type if not already defined elsewhere
interface ErrorInfo {
  message: string; // Error message
  // Add additional error properties as needed
}
