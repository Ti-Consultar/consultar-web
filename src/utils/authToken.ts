import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const AUTH_TOKEN_KEY = "token";
const AUTH_USER_EMAIL_KEY = "auth-user-email";

interface DecodedToken {
  exp?: number;
}

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

export const setAuthUserEmail = (email: string) => {
  if (canUseLocalStorage()) {
    localStorage.setItem(AUTH_USER_EMAIL_KEY, email);
  }
};

export const getAuthUserEmail = () => {
  return canUseLocalStorage()
    ? localStorage.getItem(AUTH_USER_EMAIL_KEY)
    : null;
};

export const getAuthToken = () => {
  return (
    Cookies.get(AUTH_TOKEN_KEY) ||
    (canUseLocalStorage() ? localStorage.getItem(AUTH_TOKEN_KEY) : null)
  );
};

export const hasValidAuthToken = () => {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);

    if (!decoded.exp) {
      return true;
    }

    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY);

  if (canUseLocalStorage()) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_EMAIL_KEY);
    localStorage.removeItem("userData");
  }
};
