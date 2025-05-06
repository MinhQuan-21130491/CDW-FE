// reducer.js
const initialState = {
  users: [], // Danh sách người dùng tìm được
  error: null,
  loading: false,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SEARCH_USER_REQUEST":
    case "GET_ALL_USER_REQUEST":
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

    case "SEARCH_USER_FAILURE":
      return {
        ...state,
        error: action.payload, // Cập nhật lỗi nếu có
        loading: false,
      };
    case "GET_ALL_USER_FAILURE":
      return {
        ...state,
        users: action.payload, // Cập nhật danh sách người dùng tìm được
        loading: false,
      };
    default:
      return state;
  }
};
