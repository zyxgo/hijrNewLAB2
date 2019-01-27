import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

// import { SignUpLink } from '../SignUp';
// import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
// import * as ROUTES from '../../constants/routes';

// import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const FormPengajuanUjiDetail = () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', margin: 10}}>
    {/* <Paper style={{padding: 10, width: 300}}> */}
      <Typography variant="h4" gutterBottom>
        Form Permohonan Pengujian Detail Sample
      </Typography>
      {/* <FormIsian /> */}
    {/* </Paper> */}
  </div>
);

const INITIAL_STATE = {
  idPermohonanUji: '',
  jenisSample: '',
  jumlahSample: '',
  kondisiSample: '',
  jenisPengujian: '',
  ruangLingkup: '',
  error: null,
};

class FormIsianDetailBase extends Component {
  constructor(props) {
    super(props);
    this.state = { idPermohonanUji: this.props.newIdSamplex, ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { 
      // idPermohonanUji, 
      jenisSample, jumlahSample, kondisiSample, jenisPengujian, ruangLingkup,
      // error 
    } = this.state;

      this.props.firebase
      .db.ref('samples/' + this.props.newIdSamplex + '/zItems').push({
        jenisSample,
        jumlahSample,
        kondisiSample,
        jenisPengujian,
        ruangLingkup,
      });
    
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    const { 
      jenisSample, jumlahSample, kondisiSample, jenisPengujian, ruangLingkup, 
      error 
    } = this.state;
    const isInvalid = 
    jenisSample === ''  ||
    jumlahSample === '' ||
    kondisiSample === '' ||
    jenisPengujian === '' ||
    ruangLingkup === '';
    
    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="jenisSample"
          label="jenisSample"
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <TextField
          id="jumlahSample"
          label="jumlahSample"
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <TextField
          id="kondisiSample"
          label="kondisiSample"
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <TextField
          id="jenisPengujian"
          label="jenisPengujian"
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <TextField
          id="ruangLingkup"
          label="ruangLingkup"
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <Button variant="contained" color="primary" disabled={isInvalid} type="submit">
          Submit Data Detail Sample
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const FormIsianDetail = compose(
  withRouter,
  withFirebase,
)(FormIsianDetailBase);

export default FormPengajuanUjiDetail;

export { FormIsianDetail };