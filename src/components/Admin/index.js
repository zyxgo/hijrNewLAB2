import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
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
            Admin Page
          </Typography>
          <Switch>
            <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
            <Route exact path={ROUTES.ADMIN} component={UserList} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}

/////////////////////////////////////////// ALL DATA
class UserListBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: [],
      }; 
  }
    
  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));
      this.setState({
        users: usersList,
        loading: false,
      }); 
    });
  }
  
  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  handleDelete = propSample =>
  this.props.firebase.db.ref('users/' + propSample).remove();

  
  render() {
    const { users, loading } = this.state;
    console.log(users);
    return (
      <div>
        <h2>Users</h2>
        {loading && <div>Loading ...</div>} 
          <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell colSpan={2}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && !!users && users.map((el, key) => 
                  <TableRow key={key}>
                    <TableCell>{el.email}</TableCell>
                    <TableCell>{el.username}</TableCell>
                    <TableCell>{el.area}</TableCell>
                    <TableCell>{el.roles}</TableCell>
                      <TableCell>
                        { el.roles[0] === 'ADMIN' ? '' :
                          <Button component={Link} 
                              to={{
                                pathname: `${ROUTES.ADMIN}/${el.uid}`,
                                state: { el },
                              }}
                            >
                              Detail
                          </Button>
                        }
                      </TableCell>
                    <TableCell>
                      { el.roles[0] === 'ADMIN' ? '' :
                        <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.uid)}>
                          Hapus
                        </Button>
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
      </div>
    ); 
  }

}

/////////////////////////////////////////// UBAH DATA
class UserItemBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null,
      open: false,
      ...props.location.state,
    }; 
  }
  
  componentDidMount() {
    if (this.state.user) {
      return;
    }
    this.setState({ loading: true });
    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          user: snapshot.val(),
          area: snapshot.val().area,
          roles: snapshot.val().roles,
          loading: false,
        }); 
        // console.log(snapshot.val());
      });
    // console.log(this.props);
    // console.log(this.state);
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
  };

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = () => {
    // console.log(this.state);
    this.setState({ open: false });
    const roles = [];
    roles.push(this.state.roles);
    this.props.firebase.db.ref('users/' + this.props.match.params.id).update({
      area: this.state.area,
      roles,
    })
  }

  
  render() {
    const { user, loading, area, roles } = this.state;
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Ubah Data
        </Button>{' '}
        <Button>
          <Link 
            to={{
              pathname: `${ROUTES.ADMIN}`,
            }}
          >
            BACK
          </Link>
        </Button>
        {loading && <div>Loading ...</div>}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Area</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Reset Password</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && !!user && 
                <TableRow>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.area}</TableCell>
                  <TableCell>{user.roles}</TableCell>
                  <TableCell>
                    <Button variant="text" color="primary" onClick={() => this.onSendPasswordResetEmail()}>
                      Kirim Password Reset
                    </Button>
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">User</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ubah Data area dan user role
              </DialogContentText>
              <FormControl style={{marginTop: 15}} variant="standard">
                <InputLabel htmlFor="area">Area</InputLabel>{" "}
                <Select
                  value={area}
                  onChange={this.onChange('area')}
                  style={{width:400}}
                  name="area"
                >
                  <MenuItem value="0501">0501</MenuItem>
                  <MenuItem value="0502">0502</MenuItem>
                  <MenuItem value="0503">0503</MenuItem>
                  <MenuItem value="0504">0504</MenuItem>
                  <MenuItem value="0505">0505</MenuItem>
                  <MenuItem value="0506">0506</MenuItem>
                  <MenuItem value="0507">0507</MenuItem>
                  <MenuItem value="0508">0508</MenuItem>
                  <MenuItem value="0509">0509</MenuItem>
                  <MenuItem value="0510">0510</MenuItem>
                  <MenuItem value="0511">0511</MenuItem>
                  <MenuItem value="0512">0512</MenuItem>
                  <MenuItem value="0513">0513</MenuItem>
                  <MenuItem value="0514">0514</MenuItem>
                </Select>
              </FormControl>
              <FormControl style={{marginTop: 15}} variant="standard">
                <InputLabel htmlFor="roles">Role</InputLabel>{" "}
                <Select
                  value={roles}
                  onChange={this.onChange('roles')}
                  style={{width:400}}
                  name="roles"
                >
                  <MenuItem value="WILKER">WILKER</MenuItem>
                  <MenuItem value="WILKERSPV">WILKERSPV</MenuItem>
                  <MenuItem value="ADMINLAB">ADMINLAB</MenuItem>
                  <MenuItem value="ANALYSIS">ANALYSIS</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSubmit} 
                color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
      </div>
    );
  } 

}

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);

const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);
