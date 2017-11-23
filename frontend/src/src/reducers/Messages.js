import moment from 'moment';
import uuid from 'uuid4';

const MessageReducer = (state = {isFetching: true, firstTime: true, data: []}, action) => {
    switch(action.type) {
        case "ADD_MESSAGE":
            // const uplData = action.data.pop();
            //Add confirmation
            const sendMsg = {
                author: action.data[0].author,
                body: action.data[0].body,
                id: action.data[0].id || uuid(),
                timestamp: moment(action.data[0].timestamp) || moment(),
                
            };
            console.log(action);
            console.log(sendMsg);
            
            if (action.ws) {
                action.ws.send(JSON.stringify({type: action.type, data: [sendMsg]}));
                return state;
            }
            let newState = {...state, data: [...state.data, sendMsg ]};
            console.log(newState);
            return newState;
        case "DELETE_MESSAGE":
            return state.filter(e => e.id !== action.id)
        case "MODIFY_MESSAGE":
            return state.map(e => {
                if (e.id === action.id) {
                    return {
                        author: action.data.author || e.author,
                        body: action.data.body || e.body,
                        id: e.id,
                        timestamp: e.timestamp,
                    }
                }
                return e;
            })
        case "RESET":
            return {isFetching: false, data: []};
        case "RECEIVE_DATA":
            if (!action.data) {
                console.log("No data. Exiting");
                return state;
            }
            action.data.map(e => e.timestamp = moment(e.timestamp));
            return Object.assign({}, state, {
                isFetching: false,
                data: action.data,
            })
        default:
            return state;
    }
}
export default MessageReducer;