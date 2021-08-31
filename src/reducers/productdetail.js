import { SET_PRODUCT_DETAIL } from '../actions';

const productdetail = (state = [], action) => {
  switch (action.type) {
    case SET_PRODUCT_DETAIL:
      return [...action.value];
    default: return state;
  }
}

export default productdetail;