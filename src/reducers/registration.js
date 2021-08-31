import { SET_REGISTRATION } from '../actions';

const registration = (state = [], action) => {
  switch (action.type) {
	case SET_REGISTRATION:
      return [...action.value];  
    default: return state;
  }
}

export default registration;
