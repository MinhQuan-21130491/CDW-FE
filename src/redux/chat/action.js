import { BASE_API_URL } from "../../config/api";

export const createaGroupChat = (chatData) => async (dispatch) => {
  dispatch({ type: "CREATE_CHAT_GROUP_REQUEST" });
  try {
    const res = await fetch(`${BASE_API_URL}/api/chats/create-chat/group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatData.token}`,
      },
      body: JSON.stringify(chatData.data),
    });
    const resData = await res.json();
    if (res.ok) {
      dispatch({
        type: "CREATE_CHAT_GROUP_SUCCESS",
        payload: { chat: resData.chat, status: resData.status },
      });
    } else {
      dispatch({ type: "CREATE_CHAT_GROUP_FAILURE", payload: resData.message });
    }
  } catch (err) {
    dispatch({ type: "CREATE_CHAT_GROUP_FAILURE", payload: err.message });
  }
};
export const getAllChat = (chatData) => async (dispatch) => {
  dispatch({ type: "GET_CHAT_ALL_REQUEST" });
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/chats/find-all/${chatData.userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatData.token}`,
        },
      }
    );
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: "GET_CHAT_ALL_SUCCESS", payload: resData.chats });
    } else {
      dispatch({ type: "GET_CHAT_ALL_FAILURE", payload: resData.message });
    }
  } catch (err) {
    dispatch({ type: "GET_CHAT_ALL_FAILURE", payload: err.message });
  }
};

export const getChatById = (chatData) => async (dispatch) => {
  dispatch({ type: "GET_CHAT_BY_ID_REQUEST" });
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/chats/find/${chatData.chatId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatData.token}`,
        },
      }
    );
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: "GET_CHAT_BY_ID_SUCCESS", payload: resData.chat });
    } else {
      dispatch({ type: "GET_CHAT_BY_ID_FAILURE", payload: resData.message });
    }
  } catch (err) {
    dispatch({ type: "GET_CHAT_BY_ID_FAILURE", payload: err.message });
  }
};
export const getSingleChat = (chatData) => async (dispatch) => {
  dispatch({ type: "GET_CHAT_SINGLE_REQUEST" });
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/chats/find-single?idUser=${chatData.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatData.token}`,
        },
      }
    );
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: "GET_CHAT_SINGLE_SUCCESS", payload: resData.chat });
    } else {
      dispatch({ type: "GET_CHAT_SINGLE_FAILURE", payload: resData.message });
    }
  } catch (err) {
    dispatch({ type: "GET_CHAT_SINGLE_FAILURE", payload: err.message });
  }
};
export const renameGroup = (chatData) => async (dispatch) => {
  dispatch({ type: "RENAME_GROUP_REQUEST" });
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/chats/${chatData.chatId}/rename/${encodeURIComponent(
        chatData.newName
      )}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chatData.token}`,
        },
      }
    );
    const resData = await res.json();
    console.log(resData);
    if (res.ok) {
      dispatch({ type: "RENAME_GROUP_SUCCESS", payload: resData.message });
    } else {
      dispatch({ type: "RENAME_GROUP_FAILURE", payload: resData.message });
    }
  } catch (err) {
    dispatch({ type: "RENAME_GROUP_FAILURE", payload: err.message });
  }
};
export const addUserToGroup = (data) => async (dispatch) => {
  dispatch({ type: "ADD_USER_GROUP_REQUEST" });
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/chats/${data?.chatId}/add/${data?.userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.token}`,
        },
      }
    );
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: "ADD_USER_GROUP_SUCCESS", payload: resData.message });
    } else {
      console.log(resData.message);
      dispatch({ type: "ADD_USER_GROUP_FAILURE", payload: resData.message });
    }
  } catch (err) {
    dispatch({ type: "ADD_USER_GROUP_FAILURE", payload: err.message });
  }
};
export const removeUserFromGroup = (data) => async (dispatch) => {
  dispatch({ type: "REMOVE_USER_GROUP_REQUEST" });
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/chats/${data?.chatId}/remove/${data?.userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data?.token}`,
        },
      }
    );
    const resData = await res.json();
    console.log(resData);
    if (res.ok) {
      dispatch({ type: "REMOVE_USER_GROUP_SUCCESS", payload: resData.message });
    } else {
      dispatch({ type: "REMOVE_USER_GROUP_FAILURE", payload: resData.message });
    }
  } catch (err) {
    dispatch({ type: "REMOVE_USER_GROUP_FAILURE", payload: err.message });
  }
};
