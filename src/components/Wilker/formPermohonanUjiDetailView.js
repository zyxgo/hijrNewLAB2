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
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';

const FormPengajuanUjiDetailView = () => (
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
  samples: [],
  loading: '',
};

class FormIsianDetailViewBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.db.ref('samples/' + this.props.newIdSamplex).on('value', snap => {
      const r1 = [];
      r1.push(snap.val());
      this.setState({
        samples: r1,
        loading: false,
      });
      // console.log('ViewDidMount', this.props.newIdSamplex);
    });
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('samples/' + this.props.newIdSamplex).off();
  }

  render() {
    // console.log('ViewRender', this.state.samples);
    const {samples, loading} = this.state;
    return (
      <div>
        <Typography>{loading && <div>Loading...</div>}</Typography>
        {!loading && samples.map((el, key) => 
          <div key={key}>
            <Typography>Kode Unik Sample : {el.kodeUnikSample}</Typography>
            <Typography>Tanggal Masuk Sample : {el.tanggalMasukSample}</Typography>
            <Typography>Nomor Agenda Sample : {el.nomorAgendaSample}</Typography>
            <Typography>Nama Pemilik Sample : {el.namaPemilikSample}</Typography>
            <Typography>Alamat Pemilik Sample : {el.alamatPemilikSample}</Typography>
            <Typography>Asal Tujuan Sample : {el.asalTujuanSample}</Typography>
            <Typography>Petugas Penerima Sample : {el.petugasPenerimaSample}</Typography>
              {!!el.zItems && Object.keys(el.zItems).map((el1, key1) => 
                <div key={key1}>
                  <Typography>{el.zItems[el1].jenisSample}</Typography>
                  <Typography>{el.zItems[el1].jumlahSample}</Typography>
                </div>
              )}
          </div>
        )}
      </div>
    );
  }
}

const FormIsianDetailView = compose(
  withRouter,
  withFirebase,
)(FormIsianDetailViewBase);

export default FormPengajuanUjiDetailView;

export { FormIsianDetailView };