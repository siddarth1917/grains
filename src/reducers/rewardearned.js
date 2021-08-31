import { SET_REWARDEARNED } from '../actions';

const rewardearned = (state = [], action) => {
  switch (action.type) {
    case SET_REWARDEARNED:
      return [...action.value];
    default: return state;
  }
}

export default rewardearned;
