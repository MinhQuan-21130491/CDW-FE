import { BASE_API_URL } from "../../config/api";

export const sendMessage = (data) => async (dispatch) => {
  dispatch({ type: "SEND_MESSAGE_REQUEST" });
  try {
    const res = await fetch(`${BASE_API_URL}/api/messages/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data.messageReq),
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: "SEND_MESSAGE_SUCCESS", payload: resData });
    } else {
      dispatch({ type: "SEND_MESSAGE_FAILURE", payload: resData.message });
    }
  } catch (err) {
    dispatch({ type: "SEND_MESSAGE_FAILURE", payload: err.message });
  }
};
export const sendMessageGroup = (data) => async (dispatch) => {
  console.log(data);
  dispatch({ type: "SEND_MESSAGE_GROUP_REQUEST" });
  try {
    const res = await fetch(`${BASE_API_URL}/api/messages/create/group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data.messageReq),
    });
    const resData = await res.json();
    console.log(resData);
    if (res.ok) {
      dispatch({ type: "SEND_MESSAGE_GROUP_SUCCESS", payload: resData });
    } else {
      dispatch({
        type: "SEND_MESSAGE_GROUP_FAILURE",
        payload: resData.message,
      });
    }
  } catch (err) {
    dispatch({ type: "SEND_MESSAGE_GROUP_FAILURE", payload: err.message });
  }
};
