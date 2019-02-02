import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization } from '../Session';
// import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


class MainSampleBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  render() {
    return (
      // <AuthUserContext.Consumer>
      //   {authUser => (
          <Grid style={{flex: 1, margin: 10}} item xs={12}>
            <Paper style={{padding: 10}}>
              <Typography variant="h5" gutterBottom>
                Daftar Permohonan Pengujian
              </Typography>
              <Switch>
                <Route exact path={ROUTES.WILKER_FORMUJIDETAIL} component={FormUjiDetail} />
                <Route exact path={ROUTES.WILKER_FORMUJI} component={FormUjiAll} />
              </Switch>
            </Paper>
          </Grid>
      //   )}
      // </AuthUserContext.Consumer>
    );
  }
}


///////////////////////////// PART VIEW ALL DATA
class FormUjiAllBase extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        items: [],
        open: false,
        countSampelWilker: 0,
        }; 
    }

    componentDidMount() {
      // console.log(this.props);
      this.setState({ loading: true });
      this.props.firebase.db.ref('samples')
        .on('value', snap => {
          if(snap.val()) {
            const a = [];
            snap.forEach(el => {
              a.push({
                idPermohonanUji: el.val().idPermohonanUji,
                kodeUnikSampel: el.val().kodeUnikSampel,
                tanggalMasukSampel: el.val().tanggalMasukSampel,
                nomorAgendaSurat: el.val().nomorAgendaSurat,
                namaPemilikSampel: el.val().namaPemilikSampel,
                alamatPemilikSampel: el.val().alamatPemilikSampel,
                asalTujuanSampel: el.val().asalTujuanSampel,
                petugasPengambilSampel: el.val().petugasPengambilSampel,
              })
            });
            this.setState({ 
              items: a,
              loading: false,
            });
          } else {
            this.setState({ items: null, loading: false });
          }
      })
    }

    componentWillUnmount() {
      this.props.firebase.db.ref('samples').off();
    }

    handleClickOpen = () => {
      this.setState({ open: true });
    };
  
    handleClose = () => {
      this.setState({ open: false });
    };
  
    handleSubmit = ( propSample ) => {
      this.setState({ open: false });
        if (propSample) {
          const a = this.props.firebase.db.ref('samples').push();
          this.props.firebase.db.ref('samples/' + a.key).update({
            idPermohonanUji: a.key,
            kodeUnikSampel: propSample[0].kodeUnikSampel,
            tanggalMasukSampel: propSample[0].tanggalMasukSampel,
            nomorAgendaSurat: propSample[0].nomorAgendaSurat,
            namaPemilikSampel: propSample[0].namaPemilikSampel,
            alamatPemilikSampel: propSample[0].alamatPemilikSampel,
            asalTujuanSampel: propSample[0].asalTujuanSampel,
            petugasPengambilSampel: propSample[0].petugasPengambilSampel,
        })
      }
    }

    handleDelete = propSample =>
      this.props.firebase.db.ref('samples/' + propSample).remove();

    handleUbah = propSample => {
      this.setState({ open: true });
    }

    handleGetData = a => {
      // console.log(a.authUser.area);
      if(a) {
        this.props.firebase.db.ref('masterData/wilker')
          .orderByChild('kodeWilker')
          .equalTo(a.authUser.area)
          .once('value', snap => {
            // console.log(snap.val());
            const p = [];
            snap.forEach(el => {
              p.push({
                countSampelWilker: el.val().countSampelWilker,
              })
            });
            this.setState({countSampelWilker: p});
          })
      }
    }

    render() {
      const { items, loading, countSampelWilker } = this.state;
      // console.log(countSampelWilker);
      return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
              Tambah Permohonan Pengujian
            </Button>
            <FormSampleList
              state={this.state.open}
              handleSubmit={this.handleSubmit}
              handleClose={() => this.handleClose()}
              authUser={authUser}
              handleGetData={this.handleGetData({authUser})}
              countSampelWilker={this.state.countSampelWilker}
            />
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kode Unik Sampel</TableCell>
                  <TableCell>Tanggal Masuk Sampel</TableCell>
                  <TableCell>Nomor Agenda Surat</TableCell>
                  <TableCell>Nama Pemilik Sampel</TableCell>
                  <TableCell>Asal Tujuan Sampel</TableCell>
                  <TableCell>Ubah</TableCell>
                  <TableCell>Hapus</TableCell>
                </TableRow>
              </TableHead>
              {!loading && !!items && items.map((el, key) => 
              <TableBody key={key}>
                  <TableRow>
                    <TableCell>{el.kodeUnikSampel}</TableCell>
                    <TableCell>{el.tanggalMasukSampel}</TableCell>
                    <TableCell>{el.nomorAgendaSurat}</TableCell>
                    <TableCell>{el.namaPemilikSampel}</TableCell>
                    <TableCell>{el.asalTujuanSampel}</TableCell>
                    <TableCell>
                      <Button color="secondary" component={Link} to={{
                            pathname: `${ROUTES.WILKER_FORMUJI}/${el.idPermohonanUji}`,
                            data: { el },
                          }}>
                        {/* <Link 
                          to={{
                            pathname: `${ROUTES.WILKER_FORMUJI}/${el.idPermohonanUji}`,
                            data: { el },
                          }}
                        >
                          Details
                        </Link> */}
                        Detail
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.idPermohonanUji)}>
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
              </TableBody>
              )}
            </Table>
          </div>
        )}
      </AuthUserContext.Consumer>

      )
    }

}


///////////////////////////// PART UBAH DATA
class FormUjiDetailBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      ...props.location.state,
      idPermohonanUji: '',
      kodeUnikSampel: '',
      tanggalMasukSampel: '',
      nomorAgendaSurat: '',
      namaPemilikSampel: '',
      alamatPemilikSampel: '',
      asalTujuanSampel: '',
      petugasPengambilSampel: '',
      }; 
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples/' + this.props.match.params.id)
      .on('value', snap => {
        // console.log(snap.val());
        if(snap.val()) {
          const a = [];
          a.push(snap.val());
          this.setState({ 
            items: a,
            loading: false,
            idPermohonanUji: snap.val().idPermohonanUji,
            kodeUnikSampel: snap.val().kodeUnikSampel,
            tanggalMasukSampel: snap.val().tanggalMasukSampel,
            nomorAgendaSurat: snap.val().nomorAgendaSurat,
            namaPemilikSampel: snap.val().namaPemilikSampel,
            alamatPemilikSampel: snap.val().alamatPemilikSampel,
            asalTujuanSampel: snap.val().asalTujuanSampel,
            petugasPengambilSampel: snap.val().petugasPengambilSampel,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
    })
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('samples').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true, formMode: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
      this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
        kodeUnikSampel: this.state.kodeUnikSampel,
        tanggalMasukSampel: this.state.tanggalMasukSampel,
        nomorAgendaSurat: this.state.nomorAgendaSurat,
        namaPemilikSampel: this.state.namaPemilikSampel,
        alamatPemilikSampel: this.state.alamatPemilikSampel,
        asalTujuanSampel: this.state.asalTujuanSampel,
        petugasPengambilSampel: this.state.petugasPengambilSampel,
      })
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { loading, items, kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
    } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '' || nomorAgendaSurat === '';
    return (
      <div>
          <h2>Detail Sample</h2>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Ubah Data
          </Button>{' '}
          <Button color="secondary" component={Link} 
              to={{
                pathname: `${ROUTES.WILKER_FORMUJI}`,
              }}
            >
              BACK
          </Button>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>Kode Unik Sampel</TableCell>
                <TableCell>Tanggal Masuk Sampel</TableCell>
                <TableCell>Nomor Agenda Surat</TableCell>
                <TableCell>Nama Pemilik Sampel</TableCell>
                <TableCell>Asal Tujuan Sampel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && !!items && items.map((el, key) => 
                <TableRow key={key}>
                  <TableCell>{el.kodeUnikSampel}</TableCell>
                  <TableCell>{el.tanggalMasukSampel}</TableCell>
                  <TableCell>{el.nomorAgendaSurat}</TableCell>
                  <TableCell>{el.namaPemilikSampel}</TableCell>
                  <TableCell>{el.asalTujuanSampel}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">Form Permohonan Pengujian</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ubah Data
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="kodeUnikSampel"
                label="Kode Unik Sampel"
                value={kodeUnikSampel}
                onChange={this.onChange('kodeUnikSampel')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="tanggalMasukSampel"
                label="Tanggal Masuk Sampel"
                value={ tanggalMasukSampel }
                onChange={this.onChange('tanggalMasukSampel')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="nomorAgendaSurat"
                label="Nomor Agenda Surat"
                value={nomorAgendaSurat}
                onChange={this.onChange('nomorAgendaSurat')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="namaPemilikSampel"
                label="Nama Pemilik Sampel"
                value={namaPemilikSampel}
                onChange={this.onChange('namaPemilikSampel')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="alamatPemilikSampel"
                label="Alamat Pemilik Sampel"
                value={alamatPemilikSampel}
                onChange={this.onChange('alamatPemilikSampel')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="asalTujuanSampel"
                label="Asal Tujuan Sampel"
                value={asalTujuanSampel}
                onChange={this.onChange('asalTujuanSampel')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="petugasPengambilSampel"
                label="Petugas Pengambil Sampel"
                value={petugasPengambilSampel}
                onChange={this.onChange('petugasPengambilSampel')}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={this.handleSubmit} 
                disabled={isInvalid} 
                color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
      </div>
    )
  }

}

///////////////////////////// PART TAMBAH DATA
const FormSampleList = ({ 
  state,
  handleSubmit,
  handleClose,
  authUser,
  handleGetData,
  countSampelWilker,
}) => (
  <div>
    <FormSampleBase
      state={state}
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      authUser={authUser}
      handleGetData={handleGetData}
      countSampelWilker={countSampelWilker}
    />
    {/* {console.log(countSampelWilker)} */}
  </div>
);

class FormSampleBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kodeUnikSampel: this.props.authUser.area +
       ('00000' + (parseInt(this.props.countSampelWilker, 10) + 1)).slice(-5),
      tanggalMasukSampel: '',
      nomorAgendaSurat: '',
      namaPemilikSampel: '',
      alamatPemilikSampel: '',
      asalTujuanSampel: '',
      petugasPengambilSampel: this.props.authUser.username,
      error: null,
    }; 
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onSubmit = () => {
    const a = [];
    a.push({
      kodeUnikSampel: this.state.kodeUnikSampel,
      tanggalMasukSampel: this.state.tanggalMasukSampel,
      nomorAgendaSurat: this.state.nomorAgendaSurat,
      namaPemilikSampel: this.state.namaPemilikSampel,
      alamatPemilikSampel: this.state.alamatPemilikSampel,
      asalTujuanSampel: this.state.asalTujuanSampel,
      petugasPengambilSampel: this.state.petugasPengambilSampel,
    })
    this.props.handleSubmit(a);
    this.setState({ 
      kodeUnikSampel: '',
      tanggalMasukSampel: '',
      nomorAgendaSurat: '',
      namaPemilikSampel: '',
      alamatPemilikSampel: '',
      asalTujuanSampel: '',
      petugasPengambilSampel: '',
     })
  }

  onCancel = () => {
    this.props.handleClose();
    this.setState({ 
      kodeUnikSampel: '',
      tanggalMasukSampel: '',
      nomorAgendaSurat: '',
      namaPemilikSampel: '',
      alamatPemilikSampel: '',
      asalTujuanSampel: '',
      petugasPengambilSampel: '',
     })
  }


  render() {
    const { kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
    } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '' || nomorAgendaSurat === '';

    return (
      <Dialog
        open={this.props.state}
        onClose={this.onCancel}
        aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Form Permohonan Pengujian [Header]</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tambah Data
          </DialogContentText>
          <TextField
            // autoFocus
            disabled={true}
            margin="dense"
            id="kodeUnikSampel"
            label="Kode Unik Sampel"
            value={kodeUnikSampel}
            onChange={this.onChange('kodeUnikSampel')}
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="tanggalMasukSampel"
            label="Tanggal Masuk Sampel"
            value={ tanggalMasukSampel }
            onChange={this.onChange('tanggalMasukSampel')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="nomorAgendaSurat"
            label="Nomor Agenda Surat"
            value={nomorAgendaSurat}
            onChange={this.onChange('nomorAgendaSurat')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="namaPemilikSampel"
            label="Nama Pemilik Sampel"
            value={namaPemilikSampel}
            onChange={this.onChange('namaPemilikSampel')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="alamatPemilikSampel"
            label="Alamat Pemilik Sampel"
            value={alamatPemilikSampel}
            onChange={this.onChange('alamatPemilikSampel')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="asalTujuanSampel"
            label="Asal Tujuan Sampel"
            value={asalTujuanSampel}
            onChange={this.onChange('asalTujuanSampel')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="petugasPengambilSampel"
            label="Petugas Pengambil Sampel"
            value={petugasPengambilSampel}
            onChange={this.onChange('petugasPengambilSampel')}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.onSubmit} disabled={isInvalid} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

}

const condition = authUser => !!authUser;

const FormUjiAll = withFirebase(FormUjiAllBase);
const FormUjiDetail = withFirebase(FormUjiDetailBase);


export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);