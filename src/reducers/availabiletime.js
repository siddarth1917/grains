import { SET_AVAILABLE_TIME } from '../actions';

const availabiletime = (state = [], action) => {
  switch (action.type) {
    case SET_AVAILABLE_TIME:
      return [...action.value];
    default: return state;
  }
}

export default availabiletime;