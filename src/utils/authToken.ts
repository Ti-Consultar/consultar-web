import Cookies from "js-cookie";

export const setAuthTokenCookie = (token: string, days = 3) => {
  const isBrowser = typeof window !== "undefined";
  const isSecure = isBrowser && window.location.protocol === "https:";

  Cookies.set("token", token, {
    expires: days,
    secure: isSecure,
    sameSite: "lax",
  });
};