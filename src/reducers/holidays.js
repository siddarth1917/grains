import { SET_HOLIDAYS } from '../actions';

const holidays = (state = [], action) => {
  switch (action.type) {
    case SET_HOLIDAYS:
      return [...action.value];
    default: return state;
  }
}

export default holidays;