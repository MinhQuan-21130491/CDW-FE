const initialState = {
  response: null,
  loading: false,
  error: null,
};

export const storyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_STORY_REQUEST":
    case "REMOVE_STORY_REQUEST":
      return { ...state, loading: true };

    case "ADD_STORY_SUCCESS":
      return {
        ...state,
        loading: false,
        response: action.payload,
      };

    case "REMOVE_STORY_SUCCESS":
      return {
        ...state,
        loading: false,
        response: action.payload,
      };

    case "ADD_STORY_FAILURE":
    case "REMOVE_STORY_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
