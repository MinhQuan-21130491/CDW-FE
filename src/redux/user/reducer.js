// reducer.js
const initialState = {
  users: [], // Danh sách người dùng tìm được
  error: null,
  message: null,
  loading: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SEARCH_USER_REQUEST":
    case "GET_ALL_USER_REQUEST":
    case "CHANGE_PASSWORD_REQUEST":
    case "FORGET_PASSWORD_REQUEST":
      return { ...state, loading: true };
    case "SEARCH_USER_SUCCESS":
      return {
        ...state,
        users: action.payload, // Cập nhật danh sách người dùng tìm được
        loading: false,
      };
    case "GET_ALL_USER_SUCCESS":
      return {
        ...state,
        users: action.payload, // Cập nhật danh sách người dùng tìm được
        loading: false,
      };
    case "FORGET_PASSWORD_SUCCESS":
      return {
        ...state,
        message: action.payload,
        loading: false,
      };
    case "CHANGE_PASSWORD_SUCCESS":
      return {
        ...state,
        message: action.payload,
        loading: false,
      };

    case "SEARCH_USER_FAILURE":
    case "GET_ALL_USER_FAILURE":
    case "CHANGE_PASSWORD_FAILURE":
    case "FORGET_PASSWORD_FAILURE":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};
