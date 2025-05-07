import { BASE_API_URL } from "../../config/api";

export const addStory = (data) => async (dispatch) => {
  dispatch({ type: "ADD_STORY_REQUEST" });
  try {
    const formData = new FormData();
    formData.append("userId", data.storyReq.userId);
    formData.append("type", data.storyReq.type);
    formData.append("file", data.storyReq.file);
    const res = await fetch(`${BASE_API_URL}/api/stories/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
      body: formData,
    });
    const resData = await res.json();
    // console.log(resData);
    if (res.ok) {
      dispatch({ type: "ADD_STORY_SUCCESS", payload: resData });
    } else {
      dispatch({ type: "ADD_STORY_FAILURE", payload: resData.message });
    }
  } catch (err) {
    console.log(err.message);
    dispatch({ type: "ADD_STORY_FAILURE", payload: err.message });
  }
};

export const removeStory = (data) => async (dispatch) => {
  dispatch({ type: "REMOVE_STORY_REQUEST" });
  try {
    const res = await fetch(
      `${BASE_API_URL}/api/stories/delete/${data?.storyId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    const resData = await res.json();
    if (res.ok) {
      dispatch({ type: "REMOVE_STORY_SUCCESS", payload: resData });
    } else {
      dispatch({ type: "REMOVE_STORY_FAILURE", payload: resData.message });
    }
  } catch (err) {
    dispatch({ type: "REMOVE_STORY_FAILURE", payload: err.message });
  }
};

export const getStoriesByUser = (data) => async (dispatch) => {
  dispatch({ type: "GET_STORIES_BY_USER_REQUEST" });
  try {
    const res = await fetch(`${BASE_API_URL}/api/stories/${data?.userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
    });
    const resData = await res.json();
    console.log(resData);
    if (res.ok) {
      dispatch({
        type: "GET_STORIES_BY_USER_SUCCESS",
        payload: resData.stories,
      });
    } else {
      dispatch({
        type: "GET_STORIES_BY_USER_FAILURE",
        payload: resData.message,
      });
    }
  } catch (err) {
    dispatch({ type: "GET_STORIES_BY_USER_FAILURE", payload: err.message });
  }
};
