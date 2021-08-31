import { SET_PICKUP_OUTLETS } from '../actions';

const outlets = (state = [], action) => {
  switch (action.type) {
    case SET_PICKUP_OUTLETS:
      return [...action.value];
    default: return state;
  }
}

export default outlets;