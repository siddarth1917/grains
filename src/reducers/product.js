import { SET_MENU_NAVIGATION, SET_PRODUCT } from '../actions';

const product = (state = [], action) => {
  switch (action.type) {
    case SET_MENU_NAVIGATION:{
	  var productsArr = [];
	  productsArr['productlist'] = [];
	  productsArr['menuNavigation'] = action.value;
	  var resultsArr = [];
	  resultsArr.push(productsArr);
      return [...resultsArr];
	}
	case SET_PRODUCT:{
	  var productsArr1 = [];
	  productsArr1['productlist'] = action.value;
	  productsArr1['menuNavigation'] = (Object.keys(state).length > 0)?state[0]['menuNavigation']:[];
	  var resultsArr1 = [];
	  resultsArr1.push(productsArr1);
      return [...resultsArr1];
	}
    default: return state;
  }
}

export default product;