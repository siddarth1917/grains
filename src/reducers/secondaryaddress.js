import { SET_ALLUSERSECADDRDATA } from '../actions';

const secondaryaddress = (state = [], action) => {
  switch (action.type) {
    case SET_ALLUSERSECADDRDATA:
      return [...action.value];
    default: return state;
  }
}

export default secondaryaddress;