import {createStore, compose, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {createBrowserHistory} from 'history';
import {routerMiddleware} from 'connected-react-router';

import createRootReducer from './redux/reducers/index';
import rootSaga from './redux/sagas';

export const history = createBrowserHistory()

const sagaMiddleware = createSagaMiddleware()

const initialSatate = {};

const middlewares = [sagaMiddleware, routerMiddleware(history)];
const devtools = window.__REDUX_DEVTOOLS_EXTENSION__;

//배포시 개발자 도구 숨기기
const composeEnhancer = process.env.NODE_ENV === "production" ? compose : devtools || compose;

const store = createStore(
    createRootReducer(history),
    initialSatate, //웹의 초기 값
    composeEnhancer(applyMiddleware(...middlewares)),
);
sagaMiddleware.run(rootSaga);


export default store;