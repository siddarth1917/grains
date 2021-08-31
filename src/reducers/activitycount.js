import { SET_ACTIVITYCOUNT } from '../actions';

const activitycount = (state = [], action) => {
  switch (action.type) {
	case SET_ACTIVITYCOUNT:
      return [...action.value];  
    default: return state;
  }
}

export default activitycount;
