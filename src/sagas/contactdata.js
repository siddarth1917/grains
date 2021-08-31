/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_CONTACTDATA, SET_CONTACTDATA } from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetContactData = function* () {
  yield takeEvery(GET_CONTACTDATA, workerGetContactData);
}

function* workerGetContactData({ postObject }) {
  try {
console.log(postObject)
     const result = yield call(getContactData, postObject);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_CONTACTDATA, value: resultArr });
  } 
  catch {
    console.log('updated failed');
  }
} 


function getContactData(postObject) {
  return  Axios.post(apiUrl + 'contactus/contact_us',postObject)
} 
