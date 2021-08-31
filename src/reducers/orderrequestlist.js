import { SET_ORDERRQUESTLIST } from '../actions';

const orderrequestlist = (state = [], action) => {
  switch (action.type) {
    case SET_ORDERRQUESTLIST:
      return [...action.value];
    default: return state;
  }
}

export default orderrequestlist;
