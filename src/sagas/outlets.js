import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_PICKUP_OUTLETS, SET_PICKUP_OUTLETS} from '../actions';
import { appId, apiUrl, pickupId } from "../components/Helpers/Config";
import Axios from 'axios';

export const watchGetPickupOutlets = function* () {
  yield takeEvery(GET_PICKUP_OUTLETS, workerGetPickupOutlets);
}

function* workerGetPickupOutlets() {
  try {
    const uri = apiUrl+'outlets/pickup_outlets?app_id='+appId+"&availability="+pickupId;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_PICKUP_OUTLETS, value: resultArr });
  } 
  catch {
    console.log('Get Pickup Outlets Failed');
  }
}