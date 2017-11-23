import Cookies from 'js-cookie';

const UsernameReducer = (state = getUsername(), action) => {
    switch (action.type) {
        case "UPDATE_USERNAME":
            if (!action.username.startsWith("@")) action.username = '@' + action.username;
            Cookies.set("username", action.username);
            return action.username;
        default:
            return state;
    }
}

const getUsername = () =>{
    const name = Cookies.get("username") || "@"
    return name;
}

export default UsernameReducer