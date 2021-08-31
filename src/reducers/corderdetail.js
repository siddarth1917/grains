import { SET_CORDERDETAIL } from '../actions';

const corderdetail = (state = [], action) => {
  switch (action.type) {
    case SET_CORDERDETAIL:
      return [...action.value];
    default: return state;
  }
}

export default corderdetail;
