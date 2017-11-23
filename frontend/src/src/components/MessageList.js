import React from 'react';
import Message from './Message';

const MessageList = ({Messages}) => {
    return (
        <div className="messages">{Messages && Messages.map(e => {return <Message key={e.id} message={e}/>})}</div>
    )
}

export default MessageList;