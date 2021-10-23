import axios from "axios";
import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { 
  LOGIN_FAILURE, 
  LOGIN_SUCCESS, 
  LOGIN_REQUEST, 
  LOGOUT_REQUEST, 
  LOGOUT_SUCCESS, 
  LOGOUT_FAILURE 
} from "../types";

// Login

const loginUserAPI = (loginData) => {
  console.log(loginData, "loginData");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post("api/auth", loginData, config);
};

function* loginUser(action) {
  try {
    const result = yield call(loginUserAPI, action.payload);
    console.log(result);
    yield put({
      type: LOGIN_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: LOGIN_FAILURE,
      payload: e.response,
    });
  }
}

function* watchLoginUser() {
  yield takeEvery(LOGIN_REQUEST, loginUser);
}

//로그아웃


function* logoutUser(action) {
  try {
    yield put({
      type: LOGOUT_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: LOGOUT_FAILURE,
    });
    console.log(e);
  }
}

function* watchLogoutUser() {
  yield takeEvery(LOGOUT_REQUEST, logoutUser);
}

export default function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser)
  ]);
}