import {
  LOGIN,
  REGISTER,
  REQ_USER,
  SEARCH_USER,
  UPDATE_USER,
} from "./ActionType";
const initValue = {
  signup: null,
  signin: null,
};

export const authReducer = (state = initValue, { type, payload }) => {
  if (type === REGISTER) {
    return { ...state, signup: payload };
  } else if (type === LOGIN) {
    return { ...state, signin: payload };
  } else if (type === REQ_USER) {
    return { ...state, user: payload };
  } else if (type === UPDATE_USER) {
    return { ...state, user: payload };
  } else if (type === SEARCH_USER) {
    return { ...state, signin: payload };
  }
  return state;
};
