

const WebSocketReducer = (state = {isReady: false}, action) => {
    switch(action.type) {
        case "INITIATE_CONNECTION":
        if (state.isReady) return state;
        return {
            isReady: true,
            ws: action.ws,
        }
        case "ERROR_CONNECTION":
            return {isReady: false}
        case "CLOSE_CONNECTION":
            if (!state.isReady) return state;
            state.ws.close();
            return {
                isReady: false,
            };
        default:
            return state;
    }
}





export default WebSocketReducer;