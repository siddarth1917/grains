/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_LOGINDATA, SET_LOGINDATA } from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetLoginData = function* () {
  yield takeEvery(GET_LOGINDATA, workerGetLoginData);
}

function* workerGetLoginData({ formPayload }) {
  try {
      
    const result = yield call(getLoginData, formPayload);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_LOGINDATA, value: resultArr });
  } 
  catch {
    console.log('login failed');
  }
} 


function getLoginData(formPayload) {
       return Axios.post(apiUrl+'customer/login', formPayload);
} 
