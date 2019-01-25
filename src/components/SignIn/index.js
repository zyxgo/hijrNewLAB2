import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

// import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const SignInPage = () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', margin: 10}}>
    <Paper style={{padding: 10, width: 300}}>
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      <SignInForm />
      <PasswordForgetLink />
      <SignUpLink />
    </Paper>
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="email"
          label="Email"
          // value={email}
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 5}}
          variant="outlined"
        />
        <TextField
          id="password"
          label="Password"
          // value={password}
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 5}}
          type="password"
          variant="outlined"
        />
        <Button variant="contained" color="primary" disabled={isInvalid} type="submit">
          Sign In
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };