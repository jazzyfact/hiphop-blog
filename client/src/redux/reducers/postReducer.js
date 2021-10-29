import { 
    POSTS_LOADING_FAILURE, 
    POSTS_LOADING_REQUEST, 
    POSTS_LOADING_SUCCESS,
    POSTS_WRITE_REQUEST,
    POSTS_WRITE_SUCCESS,
    POSTS_WRITE_FAILURE,
    } from '../types';

const initialState = {
    isAuthenticated : null,
    posts : [],
    postDetail : "",
    postCount : "", //게시글 갯수
    loading : false,
    error : "",
    creatorId : "",
    categoryFindResult : "",
    title : "",
    searchBy : "",
    searchResult : "",

};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action){
    switch(action.type) { 
        case POSTS_LOADING_REQUEST :
            return {
                ...state,
                posts : [],
                loading : true,
            };
        case POSTS_LOADING_SUCCESS :
            return {
                ...state,
                posts : [...state.posts, ...action.payload],
                loading : false,
            }
        case POSTS_LOADING_FAILURE :
            return {
                ...state,
                loading : false,
            };
        case POSTS_WRITE_REQUEST:
            return {
            ...state,
            posts: [],
            loading: true,
        };
        case POSTS_WRITE_SUCCESS:
            return {
                ...state,
                loading: false,
            };
        case POSTS_WRITE_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            }; 
        default:
            return state;
    }
};