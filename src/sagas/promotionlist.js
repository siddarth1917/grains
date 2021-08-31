/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_PROMOTIONLIST, SET_PROMOTIONLIST} from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetPromotionList = function* () {
  yield takeEvery(GET_PROMOTIONLIST, workerGetPromotionList);
}

function* workerGetPromotionList({ customerParam }) {
  try {
    const uri = apiUrl+'promotion_api_v2/promotionlistWhitoutuniqcode?app_id='+appId+customerParam;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_PROMOTIONLIST, value: resultArr });
  } 
  catch {
    console.log('Get Promotion list Failed');
  }
} 


