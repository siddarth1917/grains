import { takeEvery, call, put } from 'redux-saga/effects';
import {GET_ZONE_DETAIL, SET_ZONE_DETAIL } from '../actions';
import { appId, apiUrlV2, deliveryId} from "../components/Helpers/Config";
import Axios from 'axios';

export const watchGetZonedetail = function* () {
  yield takeEvery(GET_ZONE_DETAIL, workerGetZonedetail);
}

function* workerGetZonedetail({ outletId, zoneId }) {
  try {
    const uri = apiUrlV2+'outlets/getZoneDetails?app_id='+appId+"&availability="+deliveryId+"&outletId="+outletId+"&ZoneId="+zoneId;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_ZONE_DETAIL, value: resultArr });
  } 
  catch {
    console.log('Get All Outlets Failed');
  }
} 
