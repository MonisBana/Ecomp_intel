import axios from "../../../../axios-base";

export const LOGIN_URL = "/rest-auth/login/";
export const LOGOUT_URL = "/rest-auth/logout/";
export const REGISTER_URL = "/rest-auth/registration/";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";

export const ME_URL = "api/me";

export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password });
}

export function register(email, first_name, last_name, password1, password2) {
  return axios.post(REGISTER_URL, {
    email,
    first_name,
    last_name,
    password1,
    password2,
  });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}
