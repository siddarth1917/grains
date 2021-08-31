/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_REGISTRATION, SET_REGISTRATION } from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetRegistration = function* () {
  yield takeEvery(GET_REGISTRATION, workerGetRegistration);
}

function* workerGetRegistration({ formPayload }) {
  try {
   const result = yield call(getRegistration, formPayload);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_REGISTRATION, value: resultArr });
  } 
  catch {
    console.log('login failed');
  }
} 


function getRegistration(formPayload) {
       return Axios.post(apiUrl+'customer/registration', formPayload);
} 
