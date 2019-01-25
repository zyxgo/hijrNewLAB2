import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const App = () => (
  <Grid style={{flex: 1, margin: 10}} item xs={12}>
    <Paper style={{padding: 10}}>
      <Typography variant="h4" gutterBottom>
        Selamat datang di aplikasi NewLAB
      </Typography>
      <Typography variant="h5" gutterBottom>
        Halaman ini menginformasikan hasil pengujian sample anda.
      </Typography>
    </Paper>
  </Grid>
);

export default App;