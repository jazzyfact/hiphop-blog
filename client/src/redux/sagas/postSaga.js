import axios from "axios";
import { put, call, takeEvery, all, fork } from "redux-saga/effects";
import { push } from "connected-react-router";

import { 
    POSTS_LOADING_FAILURE,
    POSTS_LOADING_REQUEST, 
    POSTS_LOADING_SUCCESS 
    } from '../types';



//게시글 불러오기
const loadPostAPI = () =>{
    return axios.get("/api/post");
};

function* loadPosts()  {
    try{
        const result = yield call(loadPostAPI);
        console.log(result, "loadPosts");
        yield put({
            type : POSTS_LOADING_SUCCESS,
            payload : result.data
        })
    }catch(e){
        yield put({
           type : POSTS_LOADING_FAILURE,
           payload : e 
        })
        yield push("/")
        console.error(e);
    }
};

function* watchLoadPosts(){
    yield takeEvery(POSTS_LOADING_REQUEST, loadPosts);
}

export default function* postSaga() {
    yield all([fork(watchLoadPosts)]);
}