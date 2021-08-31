import { SET_REWARDREDEEM } from '../actions';

const rewardredeem = (state = [], action) => {
  switch (action.type) {
    case SET_REWARDREDEEM:
      return [...action.value];
    default: return state;
  }
}

export default rewardredeem;
