import {
  LOGIN,
  REGISTER,
  RELOAD_USER,
  REQ_USER,
  UPDATE_USER,
} from "./ActionType";
const initValue = {
  signup: null,
  signin: null,
  update: null,
};

export const authReducer = (state = initValue, { type, payload }) => {
  if (type === REGISTER) {
    return { ...state, signup: payload };
  } else if (type === LOGIN) {
    return { ...state, signin: payload };
  } else if (type === REQ_USER) {
    return { ...state, user: payload.userDto };
  } else if (type === UPDATE_USER) {
    return { ...state, update: payload };
  } else if (type === RELOAD_USER) {
    return {
      ...state,
      user: {
        ...state.user,
        stories: payload,
      },
    };
  }
  return state;
};
