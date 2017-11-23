import React from 'react';
import moment from 'moment';
import propTypes from 'prop-types';

const Message = ({message}) => {
    return (
        <div className="message">
            <div className="info">
                <div className="author">{message.author}</div>
                <div className="time">{message.timestamp.format('DD-MM-YYYY hh:mm:ss')}</div>
            </div>
            <div className="text">{message.body}</div>
        </div >
    )
}

Message.propTypes = {
    message: propTypes.shape({
            author: propTypes.string.isRequired,
            body: propTypes.string.isRequired,
            id: propTypes.string.isRequired,
            timestamp: propTypes.instanceOf(moment),
        })
};

export default Message;