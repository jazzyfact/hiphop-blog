import axios from "axios";
import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { 
  //로그인
  LOGIN_FAILURE, 
  LOGIN_SUCCESS, 
  LOGIN_REQUEST, 
  //로그아웃
  LOGOUT_REQUEST, 
  LOGOUT_SUCCESS, 
  LOGOUT_FAILURE,
  //로그인 상태 유지
  USER_LOADING_REQUEST,
  USER_LOADING_SUCCESS,
  USER_LOADING_FAILURE,
  //회원가입
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  //비밀번호 변경
  PASSWORD_EDIT_UPLOADING_SUCCESS,
  PASSWORD_EDIT_UPLOADING_REQUEST,
  PASSWORD_EDIT_UPLOADING_FAILURE,
  //에러
  CLEAR_ERROR_REQUEST,
  CLEAR_ERROR_SUCCESS,
  CLEAR_ERROR_FAILURE,

} from "../types";

// 로그인
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

//로그인 상태 유지
const userLodingAPI = (token) => {
  console.log(token);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if(token) {
    config.headers["x-auth-token"] = token
  }
  return axios.get("api/auth/user",  config);
};

function* userLoding(action) {
  try {
    console.log(action, "userLoading");
    const result = yield call(userLodingAPI, action.payload);
    console.log(result);
    yield put({
      type: USER_LOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: USER_LOADING_FAILURE,
      payload: e.response,
    });
  }
}
function* watchUserLoadingUser() {
  yield takeEvery(USER_LOADING_REQUEST, userLoding);
}


//회원가입
const registerUserAPI = (req) => {
  console.log(req, "req");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  return axios.post("api/user", req, config);
};

function* registerUser(action) {
  try {
    const result = yield call(registerUserAPI, action.payload);
    console.log(result, "RegisterUser Data");
    yield put({
      type: REGISTER_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: REGISTER_FAILURE,
      payload: e.response,
    });
  }
}

function* watchRegisterUser() {
  yield takeEvery(REGISTER_REQUEST, registerUser);
}


//비밀번호 변경
const EditPasswordAPI = (payload) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = payload.token;

  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return axios.post(`/api/user/${payload.userName}/profile`, payload, config);
};

function* EditPassword(action) {
  try {
    console.log(action, "EditPassword");
    const result = yield call(EditPasswordAPI, action.payload);
    yield put({
      type: PASSWORD_EDIT_UPLOADING_SUCCESS,
      payload: result.data,
    });
  } catch (e) {
    yield put({
      type: PASSWORD_EDIT_UPLOADING_FAILURE,
      payload: e.response,
    });
  }
}

function* watchEditPassword() {
  yield takeEvery(PASSWORD_EDIT_UPLOADING_REQUEST, EditPassword);
}

//에러
function* clearError() {
  try {
    yield put({
      type: CLEAR_ERROR_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: CLEAR_ERROR_FAILURE,
    });
  }
}

function* watchClearError() {
  yield takeEvery(CLEAR_ERROR_REQUEST, clearError);
}



export default function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchUserLoadingUser),
    fork(watchRegisterUser),
    fork(watchEditPassword),
    fork(watchClearError),
  ]);
}