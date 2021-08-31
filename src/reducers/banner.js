import { SET_BANNER } from '../actions';

const banner = (state = [], action) => {
  switch (action.type) {
    case SET_BANNER:
      return [...action.value];
    default: return state;
  }
}

export default banner;