import {
    //로그인
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    //로그아웃
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    //로그인 상태 유지
    USER_LOADING_REQUEST,
    USER_LOADING_SUCCESS,
    USER_LOADING_FAILURE,
    //로그아웃
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    //패스워드 변경
    PASSWORD_EDIT_UPLOADING_REQUEST,
    PASSWORD_EDIT_UPLOADING_SUCCESS,
    PASSWORD_EDIT_UPLOADING_FAILURE,
    //에러
    CLEAR_ERROR_REQUEST,
    CLEAR_ERROR_SUCCESS,
    CLEAR_ERROR_FAILURE,
  } from "../types";
  
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    isLoading: false,
    user: "",
    userId: "",
    userName: "",
    userRole: "",
    errorMsg: "",
    successMsg: "",
    previousMatchMsg : "",
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      //로그인
      case REGISTER_REQUEST:
      case LOGIN_REQUEST:
      case LOGOUT_REQUEST:
        return {
          ...state,
          errorMsg: "",
          isLoading: true,
        };
      case REGISTER_SUCCESS:
      case LOGIN_SUCCESS:
        localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        userId: action.payload.user.id,
        userRole: action.payload.user.role,
        errorMsg: "",
      };
      case REGISTER_FAILURE:
      case LOGIN_FAILURE:
      case LOGOUT_FAILURE:
        localStorage.removeItem("token");
        return {
          ...state,
          ...action.payload,
          token: null,
          user: null,
          userId: null,
          isAuthenticated: false,
          isLoading: false,
          userRole: null,
          errorMsg: action.payload.data.msg,
        };
      //로그아웃
      case LOGOUT_SUCCESS:
        localStorage.removeItem("token");
        return {
          token: null,
          user: null,
          userId: null,
          isAuthenticated: false,
          isLoading: false,
          userRole: null,
          errorMsg: "",
        };
        //유저 로딩
      case USER_LOADING_REQUEST:
        return {
          ...state,
          isLoading : true,
        };
      case USER_LOADING_SUCCESS:
        return {
          ...state,
          isAuthenticated: true,
          isLoading: false,
          user: action.payload,
          userId: action.payload._id,
          userName: action.payload.name,
          userRole: action.payload.role,
        };
      case USER_LOADING_FAILURE:
        return {
          ...state,
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          userRole: "",
        };
      case PASSWORD_EDIT_UPLOADING_REQUEST:
        return {
          ...state,
          isLoading : true,
        };
      case PASSWORD_EDIT_UPLOADING_SUCCESS:
        return {
          ...state,
          isLoading: false,
          successMsg : action.payload.data.success_msg,
          errorMsg : "",
          previousMatchMsg : "",
        };
      case PASSWORD_EDIT_UPLOADING_FAILURE:
        return {
          ...state,
          isLoading: false,
          successMsg : "",
          errorMsg :  action.payload.fail_msg,
          previousMatchMsg :  action.payload.match_msg,
        };
         //에러
      case CLEAR_ERROR_REQUEST:
        return {
          ...state,
        };
      case CLEAR_ERROR_SUCCESS:
        return {
          ...state,
          errorMsg: "",
          previousMatchMsg : "",
        };
      case CLEAR_ERROR_FAILURE:
        return {
          ...state,
          errorMsg: "Clear Error Fail",
          previousMatchMsg: "Clear Error Fail",
        };
      default:
        return state;
    }
  };
  
  export default authReducer;