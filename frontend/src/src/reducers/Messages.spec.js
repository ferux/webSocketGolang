import MessageReducer from "./Messages";
import uuid from 'uuid4';

describe('Messages test', () => {
    it('should handle initial state', () => expect(MessageReducer(undefined, "")).toEqual([]))
    it('should handle add state',     () => expect(MessageReducer([], {type: "ADD_MESSAGE", ...newMessage})).toEqual([newMessage]))
    it('should handle modify state',  
        () => expect(
            MessageReducer(
                [newMessage], 
                {
                    type: "MODIFY_MESSAGE", 
                    id: newMessage.id, 
                    data: {
                        author: "Aleksandr", 
                        body: "I'm here", 
                        timestamp: new Date()
                    }
                })).toEqual([Object.assign(updatedMessage, {id: newMessage.id})]))
    it('should handle delete state', () => expect(MessageReducer(
        [newMessage, Object.assign(updatedMessage, {id: uuid()})], 
        {
            type: "DELETE_MESSAGE",
            id: newMessage.id
        })).toEqual([updatedMessage]))
    it('should handle reset state', () => expect(MessageReducer(
        [newMessage, Object.assign(updatedMessage, {id: uuid()})], 
        {
            type: "RESET",
        })).toEqual([]))
});


const uuidNow = uuid();
const timestamp = new Date();

const newMessage = {
    author: "Alexander",
    body: "Hello world",
    timestamp: timestamp,
    id: uuidNow,
};

const updatedMessage = {
    author: "Aleksandr",
    body: "I'm here",
    timestamp: new Date(),
    id: uuid(),
};