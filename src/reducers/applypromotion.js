import { SET_APPLYPROMOTION } from '../actions';

const applypromotion = (state = [], action) => {
  switch (action.type) {
    case SET_APPLYPROMOTION:
      return [...action.value];
    default: return state;
  }
}

export default applypromotion;
