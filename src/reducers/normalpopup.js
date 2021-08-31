import { SET_NORMAL_POPUP } from '../actions';

const normalpopup = (state = [], action) => {
  switch (action.type) {
    case SET_NORMAL_POPUP:
      return [...action.value];
    default: return state;
  }
}

export default normalpopup;