import { SET_CONTACTDATA } from '../actions';

const contactdata = (state = [], action) => {
  switch (action.type) {
	case SET_CONTACTDATA:
      return [...action.value];  
    default: return state;
  }
}

export default contactdata;
