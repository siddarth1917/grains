import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_NORMAL_POPUP, SET_NORMAL_POPUP } from '../actions';
import { appId, apiUrl } from "../components/Helpers/Config";
import Axios from 'axios';

export const watchGetNormalpopup = function* () {
  yield takeEvery(GET_NORMAL_POPUP, workerGetNormalpopup);
}

function* workerGetNormalpopup() {
  try {
    const uri = apiUrl+'promotion/normal_popup?app_id='+appId;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_NORMAL_POPUP, value: resultArr });
  } 
  catch {
    console.log('Get Banner Failed');
  }
}
