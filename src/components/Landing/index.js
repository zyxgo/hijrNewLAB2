import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const App = () => (
  <Grid style={{ flex: 1, margin: 10 }} item xs={12}>
    <Paper style={{ padding: 10 }}>
      <Typography variant="h5" gutterBottom>
        Sistem Informasi Manajemen Laboratorium Karantina Hewan BBKP Makassar
      </Typography>
      {/* <Typography variant="h6" gutterBottom>
        Halaman ini menginformasikan hasil pengujian sample anda.
      </Typography> */}
    </Paper>
  </Grid>
);

export default App;