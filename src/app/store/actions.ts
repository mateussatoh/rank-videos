export enum ModalActionTypes {
   ShowNewVideoModal,
   HideNewVideoModal,
   ShowLoginModal,
   HideLoginModal,
   ShowSignupModal,
   HideSignupModal,
}

export interface ModalAction {
   type: ModalActionTypes;
   payload?: any;
}

export function showNewVideoModal(): ModalAction {
   return {
      type: ModalActionTypes.ShowNewVideoModal,
   };
}

export function hideNewVideoModal(): ModalAction {
   return {
      type: ModalActionTypes.HideNewVideoModal,
   };
}

export function showLoginModal(): ModalAction {
   return {
      type: ModalActionTypes.ShowLoginModal,
   };
}

export function hideLoginModal(): ModalAction {
   return {
      type: ModalActionTypes.HideLoginModal,
   };
}

export function showSignupModal(): ModalAction {
   return {
      type: ModalActionTypes.ShowSignupModal,
   };
}

export function hideSignupModal(): ModalAction {
   return {
      type: ModalActionTypes.HideSignupModal,
   };
}
