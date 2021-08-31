import { SET_NEWSDATA } from '../actions';

const newsdata = (state = [], action) => {
  switch (action.type) {
    case SET_NEWSDATA:
      return [...action.value];
    default: return state;
  }
}

export default newsdata;
