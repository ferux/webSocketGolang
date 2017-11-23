import React from 'react';

const FormMessage = () => {
    return (
        <form onSubmit={e => {e.preventDefault()}}>
            <input name="name-input" placeholder="Your name"/><span>&nbsp;&nbsp;&nbsp;</span>
            <input type="textarea" name="text-input" placeholder="Your message"/><span>&nbsp;&nbsp;&nbsp;</span>
            <button type="submit" onClick={onAddMessage} >OK</button>
        </form>
    );
}

export default FormMessage;