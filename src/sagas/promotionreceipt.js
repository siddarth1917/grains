/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_PROMOTIONRECEIPT, SET_PROMOTIONRECEIPT} from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';


export const watchGetPromotionReceipt = function* () {
  yield takeEvery(GET_PROMOTIONRECEIPT, workerGetPromotionReceipt);
}

function* workerGetPromotionReceipt({ params }) {
  try {
    const uri = apiUrl+'promotion_api_v2/promotion_details?app_id='+appId+params;
    console.log(uri)
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_PROMOTIONRECEIPT, value: resultArr });
  } 
  catch {
    console.log('failed');
  }
} 
