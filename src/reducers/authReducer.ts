export const userInitialState = {
  email: '',
  username: '',
  token: ''
};

export type userStateType = typeof userInitialState;

export type userActionType = { type: "SET_USER"; payload: any };

export const authReducer: React.Reducer<userStateType, userActionType> = (
  state: userStateType,
  action: userActionType
) => {
   
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        isHeaderFixed: action.payload,
      };

    default: {
    }
  }
};
