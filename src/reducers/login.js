import { SET_LOGINDATA } from '../actions';

const login = (state = [], action) => {
  switch (action.type) {
	case SET_LOGINDATA:
      return [...action.value];  
    default: return state;
  }
}

export default login;
