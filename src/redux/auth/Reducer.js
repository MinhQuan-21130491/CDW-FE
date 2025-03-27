import {
    LOGIN,
    REGISTER,
  } from "./ActionType";

  const initValue = {
    signup: null,
    signin: null
  }

  export const authReducer = (state=initValue, {type, payload}) => {
    if(type === REGISTER) {
        return {...state, signup:payload}
    }else if(type === LOGIN) {
        return {...state, signin:payload}
    }
    return state;
  }