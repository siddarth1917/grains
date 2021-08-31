import { SET_ADDONPRODUCT } from '../actions';

const addonproduct = (state = [], action) => {
  switch (action.type) {
	case SET_ADDONPRODUCT:
      return [...action.value];  
    default: return state;
  }
}

export default addonproduct;