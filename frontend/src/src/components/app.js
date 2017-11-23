import React from 'react';
// import MessageList from './MessageList';
import MessageList from "../containers/MessageListContainer";
import FormMessage from '../containers/FormMessageContainer';

const App = ({title}) => {
    return (
        <div className="container">
            <div className="title">{title}</div>
            <FormMessage/>
            <MessageList/>
        </div>
    );
};


export default App;