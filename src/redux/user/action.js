import { BASE_API_URL } from "../../config/api";

export const searchUser = (data) => async (dispatch) => {
  dispatch({ type: "SEARCH_USER_REQUEST" });
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/users/search?query=${data.query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: "SEARCH_USER_SUCCESS", payload: resData.usersDto });
    } else {
      dispatch({ type: "SEARCH_USER_FAILURE", payload: resData.message });
    }
  } catch (error) {
    // Dispatch lỗi nếu có
    dispatch({
      type: "SEARCH_USER_FAILURE",
      payload: error.message,
    });
  }
};
export const getAllUser = (token) => async (dispatch) => {
  dispatch({ type: "GET_ALL_USER_REQUEST" });
  try {
    const res = await fetch(`${BASE_API_URL}/api/users/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: "GET_ALL_USER_SUCCESS", payload: resData.usersDto });
    } else {
      dispatch({ type: "GET_ALL_USER_FAILURE", payload: resData.message });
    }
  } catch (error) {
    // Dispatch lỗi nếu có
    dispatch({
      type: "GET_ALL_USER_FAILURE",
      payload: error.message,
    });
  }
};
export const changePassword = (data) => async (dispatch) => {
  dispatch({ type: "CHANGE_PASSWORD_REQUEST" });
  try {
    const res = await fetch(`${BASE_API_URL}/api/users/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data.request),
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: "CHANGE_PASSWORD_SUCCESS", payload: resData.message });
    } else {
      dispatch({
        type: "CHANGE_PASSWORD_FAILURE",
        payload: resData.errors.password,
      });
    }
  } catch (error) {
    // Dispatch lỗi nếu có
    dispatch({
      type: "CHANGE_PASSWORD_FAILURE",
      payload: error.message,
    });
  }
};

export const forgetPassword = (data) => async (dispatch) => {
  dispatch({ type: "FORGET_PASSWORD_REQUEST" });
  try {
    const res = await fetch(`${BASE_API_URL}/auth/forget-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.request),
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: "FORGET_PASSWORD_SUCCESS", payload: resData.message });
    } else {
      dispatch({ type: "FORGET_PASSWORD_FAILURE", payload: resData.message });
    }
  } catch (error) {
    // Dispatch lỗi nếu có
    dispatch({
      type: "FORGET_PASSWORD_FAILURE",
      payload: error.message,
    });
  }
};
