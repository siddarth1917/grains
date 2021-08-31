/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_FBLOGINDATA, SET_FBLOGINDATA } from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetFbLoginData = function* () {
  yield takeEvery(GET_FBLOGINDATA, workerGetFbLoginData);
}

function* workerGetFbLoginData({ formPayload }) {
  try {
      
    const result = yield call(getFbLoginData, formPayload);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_FBLOGINDATA, value: resultArr });
  } 
  catch {
    console.log('login failed');
  }
} 


function getFbLoginData(formPayload) {
       return Axios.post(apiUrl+'customer/fbloginapp', formPayload);
} 
