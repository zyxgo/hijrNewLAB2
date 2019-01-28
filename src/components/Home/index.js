import React, { Component } from 'react';
import { withAuthorization, AuthUserContext, } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    }; 
  }
  
  componentDidMount() {
    this.props.firebase.users().on('value', snapshot => {
      this.setState({
        users: snapshot.val(),
      }); 
      console.log(snapshot.val())
    });
  }
  
  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    return (
      <Grid style={{flex: 1, margin: 10}} item xs={12}>
        <Paper style={{padding: 10}}>
          <Typography variant="h5" gutterBottom>
            Selamat datang di aplikasi NewLAB
          </Typography>
          <Typography variant="h6" gutterBottom>
            Halaman ini menginformasikan hasil pengujian sample anda.
          </Typography>
          <Messages users={this.state.users} />
        </Paper>
      </Grid>
    ); 
  }

}

class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      messages: [],
      text: '',
      limit: 5,
    }; 
  }
  
  componentDidMount() {
    this.onListenForMessages();
  }

  onListenForMessages() {
    this.setState({ loading: true });

    this.props.firebase
      .messages()
      .orderByChild('createdAt')
      .limitToLast(this.state.limit)
      .on('value', snapshot => {
        const messageObject = snapshot.val();

        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key,
          }));

          this.setState({ 
            messages: messageList,
            loading: false 
          });
        } else {
          this.setState({ messages: null, loading: false });
        }
      });
  }

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }
  
  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });
    this.setState({ text: '' });
    event.preventDefault();
  };

  onEditMessage = (message, text) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      text, 
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };
  
  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForMessages,
    );
  };

  render() {
    const { users } = this.props;
    const { text, messages, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {!loading && messages && (
              <button type="button" onClick={this.onNextPage}>
                More
              </button>
            )}

            {loading && <div>Loading ...</div>}

            {messages && (
              <MessageList
                messages={messages.map(message => ({
                  ...message,
                  user: users
                    ? users[message.userId]
                    : { userId: message.userId },
                }))}
                onEditMessage={this.onEditMessage}
                onRemoveMessage={this.onRemoveMessage}
              />
            )}

            {!messages && <div>There are no messages ...</div>}

            <form onSubmit={event => this.onCreateMessage(event, authUser)}>
              <input
                type="text"
                value={text}
                onChange={this.onChangeText}
            />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    ); 
  }

}

const MessageList = ({ 
  messages, 
  onRemoveMessage, 
  onEditMessage, 
}) => (
  <ul>
    {messages.map(message => (
      <MessageItem 
        key={message.uid} 
        message={message} 
        onRemoveMessage={onRemoveMessage}
        onEditMessage={onEditMessage}
      />
    ))} 
  </ul>
);

class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editText: this.props.message.text,
    }; 
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text,
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);
    this.setState({ editMode: false });
  };

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;
    return (
      <li> 
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          /> 
        ):(
          <span>
            <strong>
              {message.user.username || message.user.userId}
            </strong> {' '}
            {message.text} {message.editedAt && <span>(Edited)</span>}
          </span>
        )}

        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </span>
        ):(
          <button onClick={this.onToggleEditMode}>Edit</button>
        )}

        {!editMode && (
          <button
            type="button"
            onClick={() => onRemoveMessage(message.uid)}
          > 
            Delete
          </button>
        )}
      </li>
    );
  }

}
  

// const MessageItem = ({ message, onRemoveMessage }) => (
//   <li>
//     <strong>{message.userId}</strong> {message.text}
//     <button
//       type="button"
//       onClick={() => onRemoveMessage(message.uid)}
//     >
//       Delete
//     </button>
//   </li>
// );

const Messages = withFirebase(MessagesBase);

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  // withEmailVerification,
  withAuthorization(condition),
)(HomePage);