import { SET_CART_DETAIL } from '../actions';

const cartlistdetail = (state = [], action) => {
  switch (action.type) {
    case SET_CART_DETAIL:
      return [...action.value];
    default: return state;
  }
}

export default cartlistdetail;