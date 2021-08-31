/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_CUSTOMER_DETAIL, SET_CUSTOMER_DETAIL } from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetCustomerDetail = function* () {
  yield takeEvery(GET_CUSTOMER_DETAIL, workerGetCustomerDetail);
}

function* workerGetCustomerDetail({ params }) {
  try {
    const uri = apiUrl+'customer/customerdetail?app_id='+appId+params;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_CUSTOMER_DETAIL, value: resultArr });
  } 
  catch {
    console.log('Get Customer Failed');
  }
} 

