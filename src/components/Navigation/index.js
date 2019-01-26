import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <div style={{flexGrow: 1}}>
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton className={{marginLeft: -12, marginRight: 20}} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" color="inherit" style={{marginRight: 20}} >
          Aplikasi NewLAB
        </Typography>
        {/* <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.LANDING}>Landing</Button> */}
        <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.HOME}>Home</Button>
        <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.WILKER}>Wilker</Button>
        <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.ACCOUNT}>Account</Button>
        <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.ADMIN}>Admin</Button>
        <SignOutButton />
      </Toolbar>
    </AppBar>
  </div>
);

const NavigationNonAuth = () => (
  <div style={{flexGrow: 1}}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{marginRight: 20}} >
          Aplikasi NewLAB
        </Typography>
        {/* <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.LANDING}>Landing</Button> */}
        <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.SIGN_IN}>Sign In</Button>
      </Toolbar>
    </AppBar>
  </div>
);

NavigationAuth.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};