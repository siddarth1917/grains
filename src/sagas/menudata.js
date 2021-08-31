/* eslint-disable */
import { takeEvery, call, put } from 'redux-saga/effects';
import { GET_MENUDATA, SET_MENUDATA } from '../actions';
import { appId, apiUrl, apiUrlV2, deliveryId } from "../components/Helpers/Config";
import Axios from 'axios';
import cookie from 'react-cookies';

export const watchGetMenuData = function* () {
  yield takeEvery(GET_MENUDATA, workerGetMenuData);
}

function* workerGetMenuData({ menuslug }) {
  try {
    const uri = apiUrl+'menu/menu?app_id='+appId+'&menu_slug='+menuslug;
    const result = yield call(Axios.get, uri);
	var resultArr = [];
	resultArr.push(result.data);
    yield put({ type: SET_MENUDATA, value: resultArr });
  } 
  catch {
    console.log('Get Menu Failed');
  }
} 
