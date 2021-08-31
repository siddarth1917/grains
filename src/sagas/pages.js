/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_REQUESTPAGEDATA, SET_REQUESTPAGEDATA} from '../actions';
import { appId, apiUrl, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetRequestpage = function* () {
  yield takeEvery(GET_REQUESTPAGEDATA, workerGetRequestpage);
}

function* workerGetRequestpage({slug}) {
  try {
    const uri = apiUrl+'cms/page?status=A&app_id='+appId+'&page_slug='+slug;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_REQUESTPAGEDATA, value: resultArr });
  } 
  catch {
    console.log('Get Page Failed');
  }
} 

