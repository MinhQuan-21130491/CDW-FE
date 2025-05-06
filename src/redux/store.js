import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./auth/Reducer";
import { chatReducer } from "./chat/reducer";
import { userReducer } from "./user/reducer";
import { messageReducer } from "./message/reducer";
import { storyReducer } from "./story/reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  user: userReducer,
  message: messageReducer,
  story: storyReducer,
});
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
