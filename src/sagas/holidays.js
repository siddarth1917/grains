import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_HOLIDAYS, SET_HOLIDAYS } from '../actions';
import { appId, apiUrl } from "../components/Helpers/Config";
import Axios from 'axios';

export const watchGetHolidays = function* () {
  yield takeEvery(GET_HOLIDAYS, workerGetHolidays);
}

function* workerGetHolidays() {
  try {
    const uri = apiUrl+'settings/get_holidaylist?app_id='+appId;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_HOLIDAYS, value: resultArr });
  } 
  catch {
    console.log('Get Holidays Failed');
  }
} 
