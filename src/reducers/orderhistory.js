import { SET_ORDERHISTORY } from '../actions';

const orderhistory = (state = [], action) => {
  switch (action.type) {
    case SET_ORDERHISTORY:
      return [...action.value];
    default: return state;
  }
}

export default orderhistory;
