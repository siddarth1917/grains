import { SET_PROMOTIONLIST } from '../actions';

const promotionlist = (state = [], action) => {
  switch (action.type) {
    case SET_PROMOTIONLIST:
      return [...action.value];
    default: return state;
  }
}

export default promotionlist;
