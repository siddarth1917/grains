import { SET_FEATUREPRO } from '../actions';

const featureproduct = (state = [], action) => {
  switch (action.type) {
	case SET_FEATUREPRO:
      return [...action.value];  
    default: return state;
  }
}

export default featureproduct;