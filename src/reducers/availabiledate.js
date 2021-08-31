import { SET_AVAILABLE_DATE, SET_DEFAULTAVL_DATE } from '../actions';

const availabiledate = (state = [], action) => {
  switch (action.type) {
    case SET_AVAILABLE_DATE:
      return [...action.value];
	case SET_DEFAULTAVL_DATE:
      return [...action.value];
    default: return state;
  }
}

export default availabiledate;