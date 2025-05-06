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
