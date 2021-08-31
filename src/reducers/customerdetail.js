import { SET_CUSTOMER_DETAIL } from '../actions';

const customerdetail = (state = [], action) => {
  switch (action.type) {
    case SET_CUSTOMER_DETAIL:
      return [...action.value];
    default: return state;
  }
}

export default customerdetail;
