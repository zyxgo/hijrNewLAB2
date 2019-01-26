import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

// import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const FormPengajuanUji = () => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', margin: 10}}>
    {/* <Paper style={{padding: 10, width: 300}}> */}
      <Typography variant="h4" gutterBottom>
        Form Permohonan Pengujian
      </Typography>
      <FormIsian />
    {/* </Paper> */}
  </div>
);

const INITIAL_STATE = {
  kodeUnikSample: '',
  tanggalMasukSample: '',
  nomorAgendaSample: '',
  namaPemilikSample: '',
  alamatPemilikSample: '',
  asalTujuanSample: '',
  jenisSample: '',
  jumlahSample: '',
  kondisiSample: '',
  jenisPengujian: '',
  ruangLingkup: '',
  petugasPenerimaSample: '',
  error: null,
};

class FormIsianBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { kodeUnikSample, tanggalMasukSample, nomorAgendaSample, namaPemilikSample, alamatPemilikSample,
      asalTujuanSample,
      // jenisSample, jumlahSample, kondisiSample, jenisPengujian, ruangLingkup,
      // petugasPenerimaSample,
      error 
    } = this.state;

    this.props.firebase
      .db.ref('samples').push({
        kodeUnikSample,
        tanggalMasukSample,
        nomorAgendaSample,
        namaPemilikSample,
        alamatPemilikSample,
        asalTujuanSample,
        // jenisSample,
        // jumlahSample,
        // kondisiSample,
        // jenisPengujian,
        // ruangLingkup, 
        // petugasPenerimaSample,
      });
      
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    const { kodeUnikSample, tanggalMasukSample, nomorAgendaSample, namaPemilikSample, alamatPemilikSample,
      asalTujuanSample, 
      // jenisSample, jumlahSample, kondisiSample, jenisPengujian, ruangLingkup, 
      // petugasPenerimaSample, 
      error 
    } = this.state;
    const isInvalid = kodeUnikSample === '' ||
    tanggalMasukSample === '' ||
    nomorAgendaSample === '' ||
    namaPemilikSample === '' ||
    alamatPemilikSample === '' ||
    asalTujuanSample === '';
    // jenisSample === '' ||
    // jumlahSample === '' ||
    // kondisiSample === '' ||
    // jenisPengujian === '' ||
    // ruangLingkup === '' ||
    // petugasPenerimaSample === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="kodeUnikSample"
          label="Kode Unik Sample"
          // value={email}
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <TextField
          id="tanggalMasukSample"
          label="Tanggal Masuk Sample"
          // value={password}
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          // type="password"
          variant="outlined"
        />
        <TextField
          id="nomorAgendaSample"
          label="Nomor Agenda Sample"
          // value={password}
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          // type="password"
          variant="outlined"
        />
        <TextField
          id="namaPemilikSample"
          label="Nama Pemilik Sample"
          // value={password}
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          // type="password"
          variant="outlined"
        />
        <TextField
          id="alamatPemilikSample"
          label="Alamat Pemilik Sample"
          // value={password}
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          // type="password"
          variant="outlined"
        />
        <TextField
          id="asalTujuanSample"
          label="Asal Tujuan Sample"
          // value={password}
          onChange={this.onChange}
          style={{width: "100%", marginBottom: 10}}
          // type="password"
          variant="outlined"
        />
        <Button variant="contained" color="primary" disabled={isInvalid} type="submit">
          Submit
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const FormIsian = compose(
  withRouter,
  withFirebase,
)(FormIsianBase);

export default FormPengajuanUji;

export { FormIsian };