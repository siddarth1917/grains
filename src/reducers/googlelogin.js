import { SET_GOOGLELOGINDATA } from "../actions";

const googlelogin = (state = [], action) => {
  switch (action.type) {
    case SET_GOOGLELOGINDATA:
      return [...action.value];
    default:
      return state;
  }
};

export default googlelogin;
