import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Sample from './sample';

const MasterDataPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Grid style={{flex: 1, margin: 10}} item xs={12}>
        {/* <Paper style={{padding: 10}}> */}
          {/* <Typography variant="h4" gutterBottom>
            Master Data Page
          </Typography> */}
          <Sample />
        {/* </Paper> */}
      </Grid>   
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(MasterDataPage);