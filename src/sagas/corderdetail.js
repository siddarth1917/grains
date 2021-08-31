/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_CORDERDETAIL, SET_CORDERDETAIL, GET_PRINTORDER, SET_PRINTORDER} from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetCorderDetail = function* () {
  yield takeEvery(GET_CORDERDETAIL, workerGetCorderDetail);
}

function* workerGetCorderDetail({ deliveryparams }) {
  try {
    const uri = apiUrl+'reports/order_history?order_status=C&app_id='+appId+deliveryparams;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_CORDERDETAIL, value: resultArr });
  } 
  catch {
    console.log('Get Current order Failed');
  }
} 

