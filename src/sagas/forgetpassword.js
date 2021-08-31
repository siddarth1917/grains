/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_FORGET_PASSWORD, SET_FORGET_PASSWORD } from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetForgetPassword = function* () {
  yield takeEvery(GET_FORGET_PASSWORD, workerGetForgetPassword);
}

function* workerGetForgetPassword({ formPayload }) {
  try {
      console.log(formPayload)
    const result = yield call(getForgetPassword, formPayload);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_FORGET_PASSWORD, value: resultArr });
  } 
  catch {
    console.log('failed');
  }
} 


function getForgetPassword(formPayload) {
       return Axios.post(apiUrl+'customer/forgot_password', formPayload);
} 
