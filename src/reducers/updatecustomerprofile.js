import { SET_UPDATECUSTOMERPROFILE } from '../actions';

const updatecustomerprofile = (state = [], action) => {
  switch (action.type) {
	case SET_UPDATECUSTOMERPROFILE:
      return [...action.value];  
    default: return state;
  }
}

export default updatecustomerprofile;
