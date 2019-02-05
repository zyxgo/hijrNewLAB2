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
import DateFnsUtils from '@date-io/date-fns';
// import {format, compareAsc} from 'date-fns/esm'
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';

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
      <Grid style={{flex: 1, margin: 10}} item xs={12}>
        <Paper style={{padding: 10}}>
          {/* <Typography variant="h5" gutterBottom>
            Master Data - Wilker 
          </Typography> */}
          <Switch>
            <Route exact path={ROUTES.WILKER_FORMUJIADD} component={SampelAdd} />
            <Route exact path={ROUTES.WILKER_FORMUJIDETAIL} component={SampelDetail} />
            <Route exact path={ROUTES.WILKER_FORMUJI} component={SampelAll} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}


///////////////////////////// VIEW ALL DATA
class SampelAllBase extends Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true,
        items: [],
        open: false,
        formMode: [],
        }; 
    }

    componentDidMount() {
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

    handleDelete = propSample =>
      this.props.firebase.db.ref('samples/' + propSample).remove();

    handleUbah = propSample => {
      this.setState({ open: true, formMode: [propSample] });
    }

    render() {
      const { items, loading } = this.state;
      return (
        <AuthUserContext.Consumer>
        {authUser => (

          <div>
            <Button variant="outlined" color="primary" 
              component={Link} to={{
                pathname: `${ROUTES.WILKER_FORMUJIADD}`,
                data: {authUser}
              }}
            >
              Tambah Data
            </Button>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Kode Unik Sampel</TableCell>
                  <TableCell>Tanggal Masuk Sampel</TableCell>
                  <TableCell>Nama Pemilik Sampel</TableCell>
                  <TableCell>Asal Tujuan Sampel</TableCell>
                  {/* <TableCell>FbId</TableCell> */}
                  <TableCell colSpan={2}>Action</TableCell>
                  {/* <TableCell>Hapus</TableCell> */}
                </TableRow>
              </TableHead>
              {!loading && !!items && items.map((el, key) => 
              <TableBody key={key}>
                  <TableRow>
                    <TableCell>{el.kodeUnikSampel}</TableCell>
                    <TableCell>{el.tanggalMasukSampel}</TableCell>
                    <TableCell>{el.namaPemilikSampel}</TableCell>
                    <TableCell>{el.asalTujuanSampel}</TableCell>
                    {/* <TableCell>{el.idPermohonanUji}</TableCell> */}
                    <TableCell>
                      <Button component={Link} 
                          to={{
                            pathname: `${ROUTES.WILKER_FORMUJI}/${el.idPermohonanUji}`,
                            data: { el },
                          }}
                        >
                          Details
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

///////////////////////////// ADD DATA
class SampelAddBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      ...props.location.state,
      idPermohonanUji: '',
      kodeUnikSampel: '',
      tanggalMasukSampel: new Date(),
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
    
    this.props.firebase.db.ref('masterData/wilker')
      .orderByChild('kodeWilker')
      .equalTo(this.props.location.data.authUser.area)
      .on('value', snap => {
          const a = [];
          // a.push(snap.val());
          snap.forEach(el => {
            a.push({
              idWilker: el.val().idWilker,
              countSampelWilker: el.val().countSampelWilker,
              kodeWilker: el.val().kodeWilker,
            })
          })
          this.setState({ 
            items: a,
            loading: false,
            kodeUnikSampel: a[0].kodeWilker + 
              ('00000' + (parseInt(a[0].countSampelWilker, 10) + 1)).slice(-5),
            tanggalMasukSampel: new Date(),
            petugasPengambilSampel: this.props.location.data.authUser.username,
          });
    })
  
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('masterData/wilker').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true, formMode: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    // this.setState({ open: false });
    // console.log(this.state.items[0]);
    const a = this.props.firebase.db.ref('samples').push();
    this.props.firebase.db.ref('samples/' + a.key ).update({
        idPermohonanUji: a.key,
        kodeUnikSampel: this.state.kodeUnikSampel,
        tanggalMasukSampel: this.state.tanggalMasukSampel,
        nomorAgendaSurat: this.state.nomorAgendaSurat,
        namaPemilikSampel: this.state.namaPemilikSampel,
        alamatPemilikSampel: this.state.alamatPemilikSampel,
        asalTujuanSampel: this.state.asalTujuanSampel,
        petugasPengambilSampel: this.state.petugasPengambilSampel,
      })
    this.props.firebase.db.ref('masterData/wilker/' + this.state.items[0].idWilker).update({
      countSampelWilker: parseInt(this.state.items[0].countSampelWilker, 10) + 1,
    })
    this.props.history.push('/wilker-formuji');
  }

  handleDateChange = date => {
    this.setState({ tanggalMasukSampel: date });
  };

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
     } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '' || nomorAgendaSurat === '' || namaPemilikSampel === '' ||
      alamatPemilikSampel === '' || asalTujuanSampel === '' || petugasPengambilSampel === '';
    return (
      <div>
          <Button component={Link}
              to={{
                pathname: `${ROUTES.WILKER_FORMUJI}`,
              }}
            >
              BACK
          </Button>
          <Typography variant="h5" gutterBottom>Tambah Sample</Typography>
          <div>
            <TextField
              disabled
              margin="dense"
              id="kodeUnikSampel"
              label="Kode Unik Sampel"
              value={kodeUnikSampel}
              onChange={this.onChange('kodeUnikSampel')}
              fullWidth
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                margin="normal"
                style={{width: 250}}
                label="Tanggal Masuk Sampel" 
                value={tanggalMasukSampel} 
                format={'MM/dd/yyyy'}
                onChange={this.handleDateChange} />
            </MuiPickersUtilsProvider>
            <TextField
              autoFocus
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
              disabled
              margin="dense"
              id="petugasPengambilSampel"
              label="Petugas Pengambil Sampel"
              value={petugasPengambilSampel}
              onChange={this.onChange('petugasPengambilSampel')}
              fullWidth
            />
            <Button style={{marginTop:15}} variant="outlined" onClick={this.handleSubmit} 
              disabled={isInvalid} 
              color="primary">
              Submit
            </Button>
            
        </div>
      </div>
    )
  }

}

///////////////////////////// UBAH DATA
class SampelDetailBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      open2: false,
      ...props.location.state,
      idPermohonanUji: '',
      kodeUnikSampel: '',
      tanggalMasukSampel: '',
      nomorAgendaSurat: '',
      namaPemilikSampel: '',
      alamatPemilikSampel: '',
      asalTujuanSampel: '',
      petugasPengambilSampel: '',
      jenisSampel: '',
      jumlahSampel: '',
      kondisiSampel: '',
      jenisPengujianSampel: '',
      ruangLingkupSampel: '',
      selectJenisPengujian: [],
      selectMetodePengujian: [],
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
    this.props.firebase.db.ref('masterData/sample')
      .once('value', snap => {
        const a = [];
        a.push(snap.val())
        this.setState({
          selectJenisPengujian: a[0],
        })
        // console.log(a);
      })
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('samples').off();
    this.props.firebase.db.ref('masterData').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClickOpen2 = () => {
    this.setState({ open2: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClose2 = () => {
    this.setState({ open2: false });
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

  handleSubmit2 = () => {
    this.setState({ open2: false });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems').push({
      jenisSampel: this.state.jenisSampel,
      jumlahSampel: this.state.jumlahSampel,
      kondisiSampel: this.state.kondisiSampel,
      jenisPengujianSampel: this.state.jenisPengujianSampel,
      ruangLingkupSampel: this.state.ruangLingkupSampel,
    })
  }

  handleDelete = propSample => {
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + propSample ).remove();
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onChange2 = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    // console.log(event.target.value);
    if(name === 'jenisSampel') {
      if(event.target.value === 'Daging Sapi') {
      this.props.firebase.db.ref('masterData/pengujian')
        .orderByChild("kategoriSampel")
        .equalTo("Bahan Asal Hewan")
        .once("value", snap => {
          console.log(snap.val())
          const a = [];
          a.push(snap.val());
          this.setState({
            selectMetodePengujian: a[0],
          })
        })
      } else {
        this.setState({
          selectMetodePengujian: null,
        })
      }
    }
  };

  onClose2 = name => {
    // console.log(name);
    if(name === 'Daging Sapi') {
      this.props.firebase.db.ref('masterData/pengujian')
        .orderByChild("kategoriSampel")
        .equalTo("Bahan Asal Hewan")
        .once("value", snap => {
          console.log(snap.val())
          const a = [];
          a.push(snap.val());
          this.setState({
            selectMetodePengujian: a[0],
          })
        })
    }
  }

  render() {
    const { kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
      jenisSampel, jumlahSampel, kondisiSampel, jenisPengujianSampel, ruangLingkupSampel,
      loading, items,
      selectJenisPengujian, selectMetodePengujian,
     } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '' || nomorAgendaSurat === '' || namaPemilikSampel === '' ||
      alamatPemilikSampel === '' || asalTujuanSampel === '' || petugasPengambilSampel === '';
    const isInvalid2 = jenisSampel === ''  || jumlahSampel === '' || kondisiSampel === '' || jenisPengujianSampel === '';
    return (
      <div>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Ubah Data
          </Button>{' '}
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen2}>
            Tambah Item Pengujian
          </Button>{' '}
          <Button component={Link}
              to={{
                pathname: `${ROUTES.WILKER_FORMUJI}`,
              }}
            >
              BACK
          </Button>
          {!loading && items.map((el, key) => 
            <div style={{marginTop:25}} key={key}>
              <Typography variant="subtitle1" gutterBottom>Kode Unik Sample : {el.kodeUnikSampel}</Typography>
              <Typography variant="subtitle1" gutterBottom>Tanggal Masuk Sample : {el.tanggalMasukSampel}</Typography>
              <Typography variant="subtitle1" gutterBottom>Nomor Agenda Sample : {el.nomorAgendaSurat}</Typography>
              <Typography variant="subtitle1" gutterBottom>Nama Pemilik Sample : {el.namaPemilikSampel}</Typography>
              <Typography variant="subtitle1" gutterBottom>Alamat Pemilik Sample : {el.alamatPemilikSampel}</Typography>
              <Typography variant="subtitle1" gutterBottom>Asal Tujuan Sample : {el.asalTujuanSampel}</Typography>
              <Typography variant="subtitle1" gutterBottom>Petugas Penerima Sample : {el.petugasPengambilSampel}</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Jenis Sampel</TableCell>
                    <TableCell>Jumlah Sampel</TableCell>
                    <TableCell>Kondisi Sampel</TableCell>
                    <TableCell>Jenis Pengujian</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!!el.zItems && Object.keys(el.zItems).map((el1, key1) => 
                    <TableRow key={key1}>
                      <TableCell>{el.zItems[el1].jenisSampel}</TableCell>
                      <TableCell>{el.zItems[el1].jumlahSampel}</TableCell>
                      <TableCell>{el.zItems[el1].kondisiSampel}</TableCell>
                      <TableCell>{el.zItems[el1].jenisPengujianSampel}</TableCell>
                      <TableCell>
                        <Button variant="text" color="secondary" onClick={() => this.handleDelete(el1)}>
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                </Table>
            </div>
          )}
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">Ubah Data</DialogTitle>
            <DialogContent>
              <TextField
                disabled
                margin="dense"
                id="kodeUnikSampel"
                label="Kode Unik Sampel"
                value={kodeUnikSampel}
                onChange={this.onChange('kodeUnikSampel')}
                fullWidth
              />
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  margin="normal"
                  style={{width: 250}}
                  label="Tanggal Masuk Sampel" 
                  value={tanggalMasukSampel} 
                  format={'MM/dd/yyyy'}
                  onChange={this.handleDateChange} />
              </MuiPickersUtilsProvider>
              <TextField
                autoFocus
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
                disabled
                margin="dense"
                id="petugasPengambilSampel"
                label="Petugas Pengambil Sampel"
                value={petugasPengambilSampel}
                onChange={this.onChange('petugasPengambilSampel')}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={this.handleClose}>
                Cancel
              </Button>
              <Button 
                variant="outlined"
                onClick={this.handleSubmit} 
                disabled={isInvalid} 
                color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.open2}
            onClose={this.handleClose2}
            // maxWidth={'md'}
            aria-labelledby="form-dialog-title1"
            >
            <DialogTitle id="form-dialog-title1">Tambah Item Pengujian</DialogTitle>
            <DialogContent>
              <FormControl variant="standard">
                <InputLabel htmlFor="jenisSampel">Jenis Sampel</InputLabel>
                <Select
                  value={jenisSampel}
                  onChange={this.onChange2('jenisSampel')}
                  style={{width:400}}
                  name="jenisSampel"
                >
                  { Object.keys(selectJenisPengujian).map(elx1 => 
                      <MenuItem key={elx1} value={selectJenisPengujian[elx1].namaSample}>{selectJenisPengujian[elx1].namaSample}</MenuItem>
                  )}
                </Select>
              </FormControl>              
              <TextField
                style={{marginTop: 15, width:400}}
                margin="dense"
                id="jumlahSampel"
                label="Jumlah Sampel"
                value={jumlahSampel}
                onChange={this.onChange2('jumlahSampel')}
                fullWidth
              />
              <FormControl style={{marginTop: 15}} variant="standard">
                <InputLabel htmlFor="kondisiSampel">Kondisi Sampel</InputLabel>{" "}
                <Select
                  value={kondisiSampel}
                  onChange={this.onChange2('kondisiSampel')}
                  style={{width:400}}
                  name="kondisiSampel"
                >
                  <MenuItem value="Normal">Normal</MenuItem>
                  <MenuItem value="Tidak Normal">Tidak Normal</MenuItem>            
                </Select>
              </FormControl>
              <FormControl style={{marginTop: 15}} variant="standard">
                <InputLabel htmlFor="jenisPengujianSampel">Jenis Pengujian Sampel</InputLabel>{" "}
                <Select
                  value={jenisPengujianSampel}
                  onChange={this.onChange2('jenisPengujianSampel')}
                  style={{width:400}}
                  name="jenisPengujianSampel"
                  onClose={this.onClose2(jenisPengujianSampel)}
                >
                  { !!selectMetodePengujian && Object.keys(selectMetodePengujian).map(elx1 => 
                      <MenuItem key={elx1} value={selectMetodePengujian[elx1].metodePengujian}>{selectMetodePengujian[elx1].metodePengujian}</MenuItem>
                  )}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={this.handleClose2}>
                Cancel
              </Button>
              <Button 
                variant="outlined"
                onClick={this.handleSubmit2} 
                disabled={isInvalid2} 
                color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          
      </div>
    )
  }

}


const condition = authUser => !!authUser;

const SampelAll = withFirebase(SampelAllBase);
const SampelDetail = withFirebase(SampelDetailBase);
const SampelAdd = withFirebase(SampelAddBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);