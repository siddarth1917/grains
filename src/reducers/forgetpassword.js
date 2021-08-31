import { SET_FORGET_PASSWORD } from '../actions';

const forgetpassword = (state = [], action) => {
  switch (action.type) {
	case SET_FORGET_PASSWORD:
      return [...action.value];  
    default: return state;
  }
}

export default forgetpassword;
