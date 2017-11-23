import {connect} from 'react-redux';
import MessageList from '../components/MessageList';

const mapPropsToState = state => ({
    Messages: state.Messages.data,
    isFetching: state.Messages.isFetching,
    firstTime: state.Messages.firstTime,
})

const mapDispatchToProps = dispatch => ({
    onModifyMessage(       ) {console.log("Modify not implemented yet")},
    onDeleteMessage(       ) {console.log("Delete not implemented yet")},
})

const MessageListContainer = connect(mapPropsToState, mapDispatchToProps)(MessageList);
export default MessageListContainer;