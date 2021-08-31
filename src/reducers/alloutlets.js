import { SET_ALL_OUTLETS } from '../actions';

const alloutlets = (state = [], action) => {
  switch (action.type) {
    case SET_ALL_OUTLETS:
      return [...action.value];
    default: return state;
  }
}

export default alloutlets;