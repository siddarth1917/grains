import { SET_ZONE_DETAIL } from '../actions';

const zonedetail = (state = [], action) => {
  switch (action.type) {
    case SET_ZONE_DETAIL:
      return [...action.value];
    default: return state;
  }
}

export default zonedetail;