import axios from "axios";
import { put, call, takeEvery, all, fork } from "redux-saga/effects";
import { push } from "connected-react-router";

import { 
    POSTS_LOADING_FAILURE,
    POSTS_LOADING_REQUEST, 
    POSTS_LOADING_SUCCESS,
    POST_UPLOADING_REQUEST,
    POST_UPLOADING_SUCCESS,
    POST_UPLOADING_FAILURE,
    POST_DETAIL_LOADING_SUCCESS,
    POST_DETAIL_LOADING_FAILURE,
    POST_DETAIL_LOADING_REQUEST,
    POST_DELETE_SUCCESS,
    POST_DELETE_FAILURE,
    POST_DELETE_REQUEST,
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


//게시글 업로드
const uploadPostAPI = (payload) =>{
    const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
    const token = payload.token;
    if(token) {
        config.headers["x-auth-token"] = token;
      }
    return axios.post("/api/post", payload, config);
};

function* uploadPosts(action)  {
    try{
        console.log(action, "uploadPosts funtion");
        const result = yield call(uploadPostAPI, action.payload);
        console.log(result, "uploadPostsAPI, action.payload");
        yield put({
            type : POST_UPLOADING_SUCCESS,
            payload : result.data
        });
        yield put(push(`/post/${result.data._id}`));
    }catch(e){
        yield put({
           type : POST_UPLOADING_FAILURE,
           payload : e 
        });
        yield put(push("/"));
        console.error(e);
    }
};

function* watchUploadPosts(){
    yield takeEvery(POST_UPLOADING_REQUEST, uploadPosts);
}


//게시글 상세보기
const loadPostDetailAPI = (payload) =>{
    console.log(payload);
    return axios.get(`/api/post/${payload}`);
};

function* loadPostDetail(action)  {
    try{
        const result = yield call(loadPostDetailAPI, action.payload);
        console.log(result, "post_detail_saga_data");
        yield put({
            type : POST_DETAIL_LOADING_SUCCESS,
            payload : result.data,
        });
    }catch(e){
        yield put({
           type : POST_DETAIL_LOADING_FAILURE,
           payload : e,
        });
        yield put(push("/"));
        console.error(e);
    }
};

function* watchloadPostDetail(){
    yield takeEvery(POST_DETAIL_LOADING_REQUEST, loadPostDetail);
}

//게시글 삭제
const DeletePostAPI = (payload) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const token = payload.token;
  
    if (token) {
      config.headers["x-auth-token"] = token;
    }
  
    return axios.delete(`/api/post/${payload.id}`, config);
  };
  
  function* DeletePost(action) {
    try {
      const result = yield call(DeletePostAPI, action.payload);
      yield put({
        type: POST_DELETE_SUCCESS,
        payload: result.data,
      });
      yield put(push("/"));
    } catch (e) {
      yield put({
        type: POST_DELETE_FAILURE,
        payload: e,
      });
    }
  }
  
  function* watchDeletePost() {
    yield takeEvery(POST_DELETE_REQUEST, DeletePost);
  }
  

export default function* postSaga() {
    yield all([
        fork(watchLoadPosts), 
        fork(watchUploadPosts),
        fork(watchloadPostDetail),
        fork(watchDeletePost),
    ]);
};