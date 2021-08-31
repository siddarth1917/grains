import { SET_REQUESTPAGEDATA } from '../actions';

const pagedata = (state = [], action) => {
  switch (action.type) {
    case SET_REQUESTPAGEDATA:
      return [...action.value];
    default: return state;
  }
}

export default pagedata;
