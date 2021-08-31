import { SET_PROMOTIONRECEIPT } from '../actions';

const promotionreceipt = (state = [], action) => {
  switch (action.type) {
    case SET_PROMOTIONRECEIPT:
      return [...action.value];
    default: return state;
  }
}

export default promotionreceipt;
