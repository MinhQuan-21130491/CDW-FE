const initialState = {
  response: null,
  loading: false,
  error: null,
};

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SEND_MESSAGE_REQUEST":
      return { ...state, loading: true };

    case "SEND_MESSAGE_SUCCESS":
      return {
        ...state,
        loading: false,
        response: action.payload, // Thêm cuộc trò chuyện mới vào danh sách
      };

    case "SEND_MESSAGE_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
