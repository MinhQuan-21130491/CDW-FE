const initialState = {
  chats: [],
  chat: [],
  status: "",
  loading: false,
  error: null,
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_CHAT_GROUP_REQUEST":
    case "GET_CHAT_ALL_REQUEST":
    case "GET_CHAT_BY_ID_REQUEST":
    case "GET_CHAT_SINGLE_REQUEST":
      return { ...state, loading: true };

    case "CREATE_CHAT_GROUP_SUCCESS":
      return {
        ...state,
        loading: false,
        chats: [...state.chats, action.payload.chat],
        status: action.payload.status,
      };
    case "GET_CHAT_ALL_SUCCESS":
      return {
        ...state,
        loading: false,
        chats: action.payload,
      };
    case "GET_CHAT_BY_ID_SUCCESS":
      return {
        ...state,
        loading: false,
        chat: action.payload,
      };
    case "GET_CHAT_BY_ID_SUCCESS":
      return {
        ...state,
        loading: false,
        chat: action.payload,
      };
    case "GET_CHAT_SINGLE_SUCCESS":
      return {
        ...state,
        loading: false,
        chat: action.payload,
      };
    case "CREATE_CHAT_GROUP_FAILURE":
    case "GET_CHAT_ALL_FAILURE":
    case "GET_CHAT_BY_ID_FAILURE":
    case "GET_CHAT_SINGLE_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
