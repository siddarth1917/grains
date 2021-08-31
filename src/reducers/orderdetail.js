import { SET_ORDER_DETAIL } from '../actions';

const orderdetail = (state = [], action) => {
  switch (action.type) {
    case SET_ORDER_DETAIL:
      return [...action.value];
    default: return state;
  }
}

export default orderdetail;
