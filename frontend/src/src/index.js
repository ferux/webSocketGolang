import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import './style/style.css';
import App from './components/app';
import Messages from './reducers/Messages';
import Username from './reducers/Username';
import WS from './reducers/WebSocketReducer';
import registerServiceWorker from './registerServiceWorker';

const connString = `ws://${document.location.host}/ws`;

const reducers = combineReducers({Messages, Username, WS});
const store = createStore(reducers);

ReactDOM.render(
    <Provider store={store}>
        <App title="Dashboard"/>
    </Provider>, 
    document.getElementById('root'));
registerServiceWorker();

const openConnectionPromise = new Promise((res, rej) => {
    let ws = new WebSocket(connString)
    
    ws.onmessage = (e) => fetchWebSocket(e);
    ws.onerror = (e) => fetchError(e);

    if (ws.readyState === ws.CLOSED) {
        rej(ws);
    };
    if (ws.readyState === ws.OPEN) {
        res(ws);
    };
    let tries = 5;
    let checkConnection = setInterval(() => {
        if (tries === 0) {
            clearInterval(checkConnection);
            rej(ws);
        }
        if (ws.readyState === ws.OPEN) {
            clearInterval(checkConnection);
            res(ws);
        }
        tries--;
    }, 1000);
})

openConnectionPromise.then(res => store.dispatch(initConnection(res)), rej => console.log("Rejected: ", rej));

const initConnection = (res) => ({type: "INITIATE_CONNECTION",ws: res});

const fetchWebSocket = (e) => {
    let dataString = JSON.parse(e.data);
    store.dispatch(dataString);
};

const fetchError = (e) => {
    console.log("Catch an error: ", e);
}