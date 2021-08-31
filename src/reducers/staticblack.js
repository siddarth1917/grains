import { SET_STATIC_BLOCK } from '../actions';

const staticblack = (state = [], action) => {
  switch (action.type) {
    case SET_STATIC_BLOCK:
      return [...action.value];
    default: return state;
  }
}

export default staticblack;