import { BASE_API_URL } from "../../config/api";
import { LOGIN, REGISTER, REQ_USER, UPDATE_USER } from "./ActionType";

export const register = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    dispatch({ type: REGISTER, payload: resData });
  } catch (error) {
    console.log(error);
  }
};
export const login = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    console.log("login", resData);
    dispatch({ type: LOGIN, payload: resData });
  } catch (err) {
    console.log(err);
  }
};
export const currentUser = (token) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    dispatch({ type: REQ_USER, payload: resData });
  } catch (err) {
    console.log(err.message);
  }
};

export const updateUser = (data) => async (dispatch) => {
  try {
    const res = await fetch(`${BASE_API_URL}/api/users/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    console.log(resData);
    dispatch({ type: UPDATE_USER, payload: resData });
  } catch (err) {
    console.log(err);
  }
};
