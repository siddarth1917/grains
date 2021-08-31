import { SET_PRINTORDER } from '../actions';

const printorder = (state = [], action) => {
  switch (action.type) {
    case SET_PRINTORDER:
      return [...action.value];
    default: return state;
  }
}

export default printorder;
