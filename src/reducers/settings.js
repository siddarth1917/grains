import { SET_GLOBAL_SETTINGS } from '../actions';

const settings = (state = [], action) => {
  switch (action.type) {
    case SET_GLOBAL_SETTINGS:
      return [...action.value];
    default: return state;
  }
}

export default settings;