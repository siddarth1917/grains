/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_APPLYPROMOTION, SET_APPLYPROMOTION } from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetApplyPromotion = function* () {
  yield takeEvery(GET_APPLYPROMOTION, workerGetApplyPromotion);
}

function* workerGetApplyPromotion({ postData }) {
  try {
	  console.log(postData)
   const result = yield call(getApplyPromotion, postData);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_APPLYPROMOTION, value: resultArr });
  } 
  catch {
    console.log('login failed');
  }
} 


function getApplyPromotion(postData) {
       return Axios.post(apiUrl + 'promotion_api_v1/apply_promotion',postData)
} 
