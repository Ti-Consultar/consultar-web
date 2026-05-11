import Cookies from "js-cookie";

const AUTH_TOKEN_KEY = "token";

const canUseLocalStorage = () => typeof window !== "undefined";

export const setAuthTokenCookie = (token: string, days = 3) => {
  const isBrowser = typeof window !== "undefined";
  const isSecure = isBrowser && window.location.protocol === "https:";

  if (canUseLocalStorage()) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: days,
    secure: isSecure,
    sameSite: "lax",
  });
};

export const getAuthToken = () => {
  return (
    Cookies.get(AUTH_TOKEN_KEY) ||
    (canUseLocalStorage() ? localStorage.getItem(AUTH_TOKEN_KEY) : null)
  );
};

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY);

  if (canUseLocalStorage()) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};
