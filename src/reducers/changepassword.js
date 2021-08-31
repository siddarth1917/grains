import { SET_CHANGEPASSWORD } from '../actions';

const changepassword = (state = [], action) => {
  switch (action.type) {
	case SET_CHANGEPASSWORD:
      return [...action.value];  
    default: return state;
  }
}

export default changepassword;
