import { SET_FBLOGINDATA } from '../actions';

const fblogin = (state = [], action) => {
  switch (action.type) {
	case SET_FBLOGINDATA:
      return [...action.value];  
    default: return state;
  }
}

export default fblogin;
