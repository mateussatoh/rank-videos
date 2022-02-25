import { combineReducers } from "@reduxjs/toolkit";
import { ModalAction, ModalActionTypes } from "./actions";

const modalInitialState = {
   modal: "",
};

function modalReducer(state = modalInitialState, action: ModalAction) {
   switch (action.type) {
      case ModalActionTypes.ShowNewVideoModal:
         return {
            ...state,
            modal: "NewVideo",
         };
      case ModalActionTypes.HideNewVideoModal:
         return {
            ...state,
            modal: "",
         };
      case ModalActionTypes.ShowLoginModal:
         return {
            ...state,
            modal: "Login",
         };
      case ModalActionTypes.HideLoginModal:
         return {
            ...state,
            modal: "",
         };
      case ModalActionTypes.ShowSignupModal:
         return {
            ...state,
            modal: "SignupModal",
         };
      case ModalActionTypes.HideSignupModal:
         return {
            ...state,
            modal: "",
         };
      default:
         return state;
   }
}

const rootReducer = combineReducers({
   modal: modalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
