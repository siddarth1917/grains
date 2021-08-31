import { SET_PORDERDETAIL } from '../actions';

const porderdetail = (state = [], action) => {
  switch (action.type) {
    case SET_PORDERDETAIL:
      return [...action.value];
    default: return state;
  }
}

export default porderdetail;
