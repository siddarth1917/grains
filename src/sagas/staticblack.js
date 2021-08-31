import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_STATIC_BLOCK, SET_STATIC_BLOCK } from '../actions';
import { appId, apiUrl } from "../components/Helpers/Config";
import Axios from 'axios';

export const watchGetStaticBlack = function* () {
  yield takeEvery(GET_STATIC_BLOCK, workerGetStaticBlack);
}

function* workerGetStaticBlack() {
  try {
    const uri = apiUrl+'cms/staticblocks?app_id='+appId;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_STATIC_BLOCK, value: resultArr });
  } 
  catch {
    console.log('Get static blocks Failed');
  }
} 
