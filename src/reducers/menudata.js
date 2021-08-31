import { SET_MENUDATA } from '../actions';

const menudata = (state = [], action) => {
  switch (action.type) {
	case SET_MENUDATA:
      return [...action.value];  
    default: return state;
  }
}

export default menudata;
