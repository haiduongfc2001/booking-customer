interface LocalStorageItem {
  [key: string]: string | null;
}

export const getLocalItem = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const setLocalItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const clearLocal = (): void => {
  localStorage.clear();
};

// Specific storage access functions with improved clarity

export const getRefreshToken = (): string | null => {
  return getLocalItem("refreshToken");
};

export const getAccessToken = (): string | null => {
  return getLocalItem("accessToken");
};

export const getAppToken = (): string | null => {
  return getLocalItem("appToken");
};

export const getUserId = (): string | null => {
  return getLocalItem("userId");
};

export const getMode = (): string => {
  let mode = getLocalItem("mode");
  if (mode === null) {
    mode = "light";
    setLocalItem("mode", mode);
  }
  return mode;
};

export const updateMode = (mode: string): void => {
  setLocalItem("mode", mode);
};

export const updateAccessToken = (accessToken: string): void => {
  setLocalItem("accessToken", accessToken);
};

export const updateRefreshToken = (refreshToken: string): void => {
  setLocalItem("refreshToken", refreshToken);
};

export const updateAppToken = (appToken: string): void => {
  setLocalItem("appToken", appToken);
};

export const updateUserId = (userId: string): void => {
  setLocalItem("userId", userId);
};

export const removeAccessToken = (): void => {
  localStorage.removeItem("accessToken");
};
