import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_NEWSDATA, SET_NEWSDATA } from '../actions';
import { appId, apiUrl } from "../components/Helpers/Config";
import Axios from 'axios';

export const watchGetNewsData = function* () {
  yield takeEvery(GET_NEWSDATA, workerGetNewsData);
}

function* workerGetNewsData() {
  try {
    const uri = apiUrl+'blog/blog_list?app_id='+appId;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_NEWSDATA, value: resultArr });
  } 
  catch {
    console.log('Get news Failed');
  }
} 
