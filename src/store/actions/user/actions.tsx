import {
  USER_SIGN_IN,
  USER_LOGOUT,
  USER_RECOVER_PASSWORD,
  USER_SIGN_UP,
  USER_RECOVER_PASSWORD_CALLBACK,
} from "../";

export const userSignIn = (user) => ({
  type: USER_SIGN_IN,
  payload: user,
});

export const useSignUp = () => {
  return {
    type: USER_SIGN_UP,
  };
};

export const userRecoverPassword = () => {
  return {
    type: USER_RECOVER_PASSWORD,
  };
};

export const userRecoverPasswordCallback = () => {
  return {
    type: USER_RECOVER_PASSWORD_CALLBACK,
  };
};

export const userLogout = () => {
  return {
    type: USER_LOGOUT,
  };
};
