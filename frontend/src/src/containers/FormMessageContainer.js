import React from 'react';
import {connect} from 'react-redux';
import Cookies from 'js-cookie';

let FormMessage = ({dispatch, username, updateUsername, ws}) => {
    let inputName;
    let inputBody;
    return (
        <form onSubmit={
            e => {
                e.preventDefault();
                console.log("Submit clicked");
                if (!inputName.value.trim()) {return}
                if (!inputBody.value.trim()) {return}
                const message = {data: [{author: inputName.value, body: inputBody.value}], ws: ws};
                console.log("Dispatching:", message);
                dispatch(AddMessage(message));
                inputBody.value = '';
                if (Cookies.get("username") !== inputName.value) Cookies.set("username", inputName.value);
                }}>
            <input ref={node => inputName = node} onChange={updateUsername} value={username} className="username" placeholder="Your name"/><span>&nbsp;&nbsp;&nbsp;</span>
            <input ref={node => inputBody = node}  type="textarea" className="message" placeholder="Your message"/><span>&nbsp;&nbsp;&nbsp;</span>
            <button className="submit" type="submit" disabled={ws && ws.readyState === 1 ? false : true || true}>OK</button>
        </form>
    );
}

const AddMessage = (message) => ({
    type: "ADD_MESSAGE",
    ...message
});

const mapStateToProps = state => ({
    username: state.Username,
    ws: state.WS.ws,
});

const mapDispatchToProps = dispatch => ({
    updateUsername(e) {dispatch(updateUser(e.target.value))},
    dispatch(...args) {dispatch(...args)}
});

const updateUser = (name) => ({
    type: "UPDATE_USERNAME",
    username: name,
});

FormMessage = connect(mapStateToProps, mapDispatchToProps)(FormMessage);


export default FormMessage;