import { SET_UPDATE_CART_DETAIL } from "../actions";

const updatecartdetail = (state = [], action) => {
  switch (action.type) {
    case SET_UPDATE_CART_DETAIL:
      return [...action.value];
    default:
      return state;
  }
};

export default updatecartdetail;
