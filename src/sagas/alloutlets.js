import { takeEvery, call, put } from 'redux-saga/effects';
import {GET_ALL_OUTLETS, SET_ALL_OUTLETS } from '../actions';
import { appId, apiUrlV2} from "../components/Helpers/Config";
import Axios from 'axios';

export const watchGetAllOutlets = function* () {
  yield takeEvery(GET_ALL_OUTLETS, workerGetAllOutlets);
}

function* workerGetAllOutlets({ availability }) {
  try {
    const uri = apiUrlV2+'outlets/getAllOutles?app_id='+appId+"&availability_id="+availability;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_ALL_OUTLETS, value: resultArr });
  } 
  catch {
    console.log('Get All Outlets Failed');
  }
} 
