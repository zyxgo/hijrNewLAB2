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
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DateFnsUtils from '@date-io/date-fns';
// import {format, compareAsc} from 'date-fns/esm'
import dateFnsFormat from 'date-fns/format';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import Input from '@material-ui/core/Input';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


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
      <Grid style={{ flex: 1, margin: 10 }} item xs={12}>
        <Paper style={{ padding: 10 }}>
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
        if (snap.val()) {
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
              flagActivity: el.val().flagActivity,
              flagStatusProses: el.val().flagStatusProses,
              flagStatusLaporan: el.val().flagStatusLaporan,
              kodeUnikSampelAdminLab: el.val().kodeUnikSampelAdminLab,
              formLaporanKeterangan: el.val().formLaporanKeterangan,
              formLaporanKesimpulan: el.val().formLaporanKesimpulan,
              manajerTeknisAdminLab: el.val().manajerTeknisAdminLab,
              unitPengujianSampel: el.val().unitPengujianSampel,
              zItems: el.val().zItems,
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

  handleSubmitKeLab = propSample => {
    this.props.firebase.db.ref('samples/' + propSample).update({
      flagActivity: 'Submit sampel ke admin lab',
      flagStatusProses: 'Sampel di Admin Lab',
    })
  }

  render() {
    const { items, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading ? <Typography>Loading...</Typography> :
              <div>
                <Button variant="outlined" color="primary"
                  component={Link} to={{
                    pathname: `${ROUTES.WILKER_FORMUJIADD}`,
                    data: { authUser }
                  }}
                >
                  Tambah Data
                </Button>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>No. Permohonan (IQFAST)</TableCell>
                      <TableCell>Tanggal Masuk Sampel</TableCell>
                      <TableCell>Nama Pemilik Sampel</TableCell>
                      <TableCell>Asal/Tujuan Media Pembawa</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell colSpan={4}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && !!items && items.map((el, key) =>
                    <TableBody key={key}>
                      <TableRow>
                        <TableCell>{el.nomorAgendaSurat}</TableCell>
                        <TableCell>{dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</TableCell>
                        <TableCell>{el.namaPemilikSampel}</TableCell>
                        <TableCell>{el.asalTujuanSampel}</TableCell>
                        <TableCell>{el.flagActivity === 'Permohonan pengujian selesai di analisa' ? el.flagActivity : el.flagStatusProses}</TableCell>
                        <TableCell>
                          <Button component={Link}
                            to={{
                              pathname: `${ROUTES.WILKER_FORMUJI}/${el.idPermohonanUji}`,
                              data: { el },
                            }}
                            disabled={el.flagActivity === "Belum ada sampel uji" || el.flagActivity === "Data sudah lengkap" ? false : true}
                          >
                            Detail
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.idPermohonanUji)}
                            disabled={el.flagActivity === "Belum ada sampel uji" || el.flagActivity === "Data sudah lengkap" ? false : true}
                          >
                            Hapus
                          </Button>
                        </TableCell>
                        {el.flagActivity === 'Laporan Hasil Uji di Admin Lab' ?
                          <TableCell>
                            <PDFDownloadLink document={<PDFLHU q={el} />} fileName="Laporan-Hasil-Uji.pdf">
                              {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Laporan Hasil Uji')}
                            </PDFDownloadLink>
                          </TableCell>
                          :
                          <TableCell>
                            <PDFDownloadLink document={<Quixote q={el} />} fileName="permohonan-pengujian.pdf">
                              {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Permohonan Pengujian')}
                            </PDFDownloadLink>
                          </TableCell>
                        }
                        <TableCell>
                          <Button variant="outlined" color="primary" onClick={() => this.handleSubmitKeLab(el.idPermohonanUji)}
                            disabled={el.flagActivity === "Data sudah lengkap" ? false : true}
                          >
                            Submit ke Lab
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
                {/* <PDFViewer>
                  <Quixote pass={el.idPermohonanUji} />
                </PDFViewer> */}
              </div>
            }
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
    this.setState({ open: true, formMode: null });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    // this.setState({ open: false });
    // console.log(this.state.items[0]);
    const a = this.props.firebase.db.ref('samples').push();
    this.props.firebase.db.ref('samples/' + a.key).update({
      idPermohonanUji: a.key,
      kodeUnikSampel: this.state.kodeUnikSampel,
      tanggalMasukSampel: this.state.tanggalMasukSampel,
      nomorAgendaSurat: this.state.nomorAgendaSurat,
      namaPemilikSampel: this.state.namaPemilikSampel,
      alamatPemilikSampel: this.state.alamatPemilikSampel,
      asalTujuanSampel: this.state.asalTujuanSampel,
      petugasPengambilSampel: this.state.petugasPengambilSampel,
      flagActivity: 'Belum ada sampel uji',
      flagStatusProses: 'Sampel di Wilker',
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
      loading,
    } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '' || nomorAgendaSurat === '' || namaPemilikSampel === '' ||
      alamatPemilikSampel === '' || asalTujuanSampel === '' || petugasPengambilSampel === '';
    return (
      <div>
        {loading ? <Typography>Loading...</Typography> :
          <div>
            <Button component={Link}
              to={{
                pathname: `${ROUTES.WILKER_FORMUJI}`,
              }}
            >
              BACK
            </Button>
            <Typography variant="h5" gutterBottom>Tambah Sampel</Typography>
            <div>
              {/* <TextField
                disabled
                margin="dense"
                id="kodeUnikSampel"
                label="Kode Unik Sampel"
                value={kodeUnikSampel}
                onChange={this.onChange('kodeUnikSampel')}
                fullWidth
              /> */}
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  margin="normal"
                  style={{ width: 250 }}
                  label="Tanggal Masuk Sampel"
                  value={tanggalMasukSampel}
                  format={'MM/dd/yyyy'}
                  onChange={this.handleDateChange} />
              </MuiPickersUtilsProvider>
              <TextField
                autoFocus
                margin="dense"
                id="nomorAgendaSurat"
                label="Nomor Permohonan (IQFAST)"
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
                label="Asal/Tujuan Media Pembawa"
                value={asalTujuanSampel}
                onChange={this.onChange('asalTujuanSampel')}
                fullWidth
              />
              <TextField
                disabled
                margin="dense"
                id="petugasPengambilSampel"
                label="Petugas Pengambil Sampel (PPC)"
                value={petugasPengambilSampel}
                onChange={this.onChange('petugasPengambilSampel')}
                fullWidth
              />
              <Button style={{ marginTop: 15 }} variant="outlined" onClick={this.handleSubmit}
                disabled={isInvalid}
                color="primary">
                Submit
              </Button>

            </div>
          </div>
        }
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
      kategoriSample: '',
      jenisSampel: '',
      jumlahSampel: '',
      kondisiSampel: '',
      jenisPengujianSampel: '',
      metodePengujianSampel: '',
      ruangLingkupSampel: '',
      targetPengujianSampel: '',
      keteranganSampel: '',
      selectJenisSampel: [],
      selectJenisPengujian: [],
      selectMetodePengujian: [],
      selectTargetPengujian: [],
    };
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples/' + this.props.match.params.id)
      .on('value', snap => {
        // console.log(snap.val());
        if (snap.val()) {
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
    this.props.firebase.db.ref('masterData/userform')
      .on('value', snap1 => {
        if (snap1.val()) {
          const b1 = [];
          snap1.forEach((res) => {
            if (res.val().jabatanUserForm === 'Wilker') {
              b1.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            }
          })
          this.setState({
            selectUserformPenyelia: b1,
          });
        }
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
    const a = this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems').push();
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key).update({
      idZItems: a.key,
      kategoriSample: this.state.kategoriSample,
      jenisSampel: this.state.jenisSampel,
      jumlahSampel: this.state.jumlahSampel,
      kondisiSampel: this.state.kondisiSampel,
      metodePengujianSampel: this.state.metodePengujianSampel,
      targetPengujianSampel: this.state.targetPengujianSampel,
      ruangLingkupSampel: this.state.ruangLingkupSampel,
      keteranganSampel: this.state.keteranganSampel,
    })
    const b = this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/').push();
    const bahanTerpakaiUrl = 'bahanTerpakai/' + a.key;
    if (this.state.metodePengujianSampel === 'ELISA RABIES' || this.state.metodePengujianSampel === 'ELISA BVD' || this.state.metodePengujianSampel === 'ELISA PARATB') {
      if (parseInt(this.state.jumlahSampel, 10) <= 8) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'ELISA',
          AQUADEST: '72', PBS_TWEEN: '8', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '3,2', STOP_SOLUTION: '3,2',
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) > 8 && parseInt(this.state.jumlahSampel, 10) <= 16) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'ELISA',
          AQUADEST: '81', PBS_TWEEN: '9', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '4,8', STOP_SOLUTION: '4,8',
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) > 16 && parseInt(this.state.jumlahSampel, 10) <= 24) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'ELISA',
          AQUADEST: '90', PBS_TWEEN: '10', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '6,4', STOP_SOLUTION: '6,4',
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) > 24 && parseInt(this.state.jumlahSampel, 10) <= 32) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'ELISA',
          AQUADEST: '99', PBS_TWEEN: '11', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '8,0', STOP_SOLUTION: '8,0',
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) > 32 && parseInt(this.state.jumlahSampel, 10) <= 40) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'ELISA',
          AQUADEST: '108', PBS_TWEEN: '12', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '9,6', STOP_SOLUTION: '9,6',
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) > 40 && parseInt(this.state.jumlahSampel, 10) <= 46) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'ELISA',
          AQUADEST: '117', PBS_TWEEN: '13', K_POS: '0,010', K_NEG: '0,0025', ST_1_EU: '0,0025', KONJUGAT: '0,0005', SUBSTRAK: '11,2', STOP_SOLUTION: '11,2',
          VORTEX: '0', ELISA_READER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0'
        })
      }
    } else if (this.state.metodePengujianSampel === 'TPC') {
      if (parseInt(this.state.jumlahSampel, 10) === 1) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '400', BPW: '8', PCA: '3', TABUNG_REAKSI: '3', CAWAN_PETRI: '8', KERTAS_TIMBANG: '1', PLASTIK_STOMACHER: '1', PLASTIK_SAMPEL: '1', FINTIPP: '7', SCALPEL: '1',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 2) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '800', BPW: '16', PCA: '6', TABUNG_REAKSI: '6', CAWAN_PETRI: '14', KERTAS_TIMBANG: '2', PLASTIK_STOMACHER: '2', PLASTIK_SAMPEL: '2', FINTIPP: '14', SCALPEL: '2',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 3) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '1200', BPW: '24', PCA: '9', TABUNG_REAKSI: '9', CAWAN_PETRI: '20', KERTAS_TIMBANG: '3', PLASTIK_STOMACHER: '3', PLASTIK_SAMPEL: '3', FINTIPP: '21', SCALPEL: '3',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 4) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '1600', BPW: '32', PCA: '12', TABUNG_REAKSI: '12', CAWAN_PETRI: '26', KERTAS_TIMBANG: '4', PLASTIK_STOMACHER: '4', PLASTIK_SAMPEL: '4', FINTIPP: '28', SCALPEL: '4',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 5) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '2000', BPW: '40', PCA: '15', TABUNG_REAKSI: '15', CAWAN_PETRI: '32', KERTAS_TIMBANG: '5', PLASTIK_STOMACHER: '5', PLASTIK_SAMPEL: '5', FINTIPP: '35', SCALPEL: '5',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 6) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '2400', BPW: '48', PCA: '18', TABUNG_REAKSI: '18', CAWAN_PETRI: '38', KERTAS_TIMBANG: '6', PLASTIK_STOMACHER: '6', PLASTIK_SAMPEL: '6', FINTIPP: '42', SCALPEL: '6',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 7) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '2800', BPW: '56', PCA: '21', TABUNG_REAKSI: '21', CAWAN_PETRI: '44', KERTAS_TIMBANG: '7', PLASTIK_STOMACHER: '7', PLASTIK_SAMPEL: '7', FINTIPP: '49', SCALPEL: '7',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 8) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '3200', BPW: '64', PCA: '24', TABUNG_REAKSI: '24', CAWAN_PETRI: '50', KERTAS_TIMBANG: '8', PLASTIK_STOMACHER: '8', PLASTIK_SAMPEL: '8', FINTIPP: '56', SCALPEL: '8',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 9) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '3600', BPW: '72', PCA: '27', TABUNG_REAKSI: '27', CAWAN_PETRI: '56', KERTAS_TIMBANG: '9', PLASTIK_STOMACHER: '9', PLASTIK_SAMPEL: '9', FINTIPP: '63', SCALPEL: '9',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 10) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '4000', BPW: '80', PCA: '30', TABUNG_REAKSI: '30', CAWAN_PETRI: '62', KERTAS_TIMBANG: '10', PLASTIK_STOMACHER: '10', PLASTIK_SAMPEL: '10', FINTIPP: '70', SCALPEL: '10',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 11) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '4400', BPW: '88', PCA: '33', TABUNG_REAKSI: '33', CAWAN_PETRI: '68', KERTAS_TIMBANG: '11', PLASTIK_STOMACHER: '11', PLASTIK_SAMPEL: '11', FINTIPP: '77', SCALPEL: '11',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 12) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'TPC',
          AQUADEST: '4800', BPW: '96', PCA: '36', TABUNG_REAKSI: '36', CAWAN_PETRI: '74', KERTAS_TIMBANG: '12', PLASTIK_STOMACHER: '12', PLASTIK_SAMPEL: '12', FINTIPP: '84', SCALPEL: '12',
          TIMBANGAN_ELEKTRIK: '0', STOMACHER: '0', HOT_PLATE_STIRER: '0', MICROWAVE: '0', VORTEX: '0', PH_METER: '0', INKUBATOR: '0', LAMINAR_AIRFLOW: '0', COLONY_COUNTER: '0'
        })
      }
    } else if (this.state.metodePengujianSampel === 'RAPID TEST KIT' && this.state.targetPengujianSampel === 'Salmonella') {
      if (parseInt(this.state.jumlahSampel, 10) === 1) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 300, BPW: 8, KIT_SALMONELLA: 1, PLASTIK_STOMACHER: 1, JUMLAH_FINTIPP: 1, JUMLAH_SCALPEL: 1,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 2) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 600, BPW: 16, KIT_SALMONELLA: 2, PLASTIK_STOMACHER: 2, JUMLAH_FINTIPP: 2, JUMLAH_SCALPEL: 2,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 3) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 900, BPW: 24, KIT_SALMONELLA: 3, PLASTIK_STOMACHER: 3, JUMLAH_FINTIPP: 3, JUMLAH_SCALPEL: 3,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 4) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 1200, BPW: 32, KIT_SALMONELLA: 4, PLASTIK_STOMACHER: 4, JUMLAH_FINTIPP: 4, JUMLAH_SCALPEL: 4,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 5) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 1500, BPW: 40, KIT_SALMONELLA: 5, PLASTIK_STOMACHER: 5, JUMLAH_FINTIPP: 5, JUMLAH_SCALPEL: 5,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 6) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 1800, BPW: 48, KIT_SALMONELLA: 6, PLASTIK_STOMACHER: 6, JUMLAH_FINTIPP: 6, JUMLAH_SCALPEL: 6,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 7) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 2100, BPW: 56, KIT_SALMONELLA: 7, PLASTIK_STOMACHER: 7, JUMLAH_FINTIPP: 7, JUMLAH_SCALPEL: 7,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 8) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 2400, BPW: 64, KIT_SALMONELLA: 8, PLASTIK_STOMACHER: 8, JUMLAH_FINTIPP: 8, JUMLAH_SCALPEL: 8,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 9) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 2700, BPW: 72, KIT_SALMONELLA: 9, PLASTIK_STOMACHER: 9, JUMLAH_FINTIPP: 9, JUMLAH_SCALPEL: 9,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 10) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 3000, BPW: 80, KIT_SALMONELLA: 10, PLASTIK_STOMACHER: 10, JUMLAH_FINTIPP: 10, JUMLAH_SCALPEL: 10,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 11) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 3300, BPW: 88, KIT_SALMONELLA: 11, PLASTIK_STOMACHER: 11, JUMLAH_FINTIPP: 11, JUMLAH_SCALPEL: 11,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 12) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 3600, BPW: 96, KIT_SALMONELLA: 12, PLASTIK_STOMACHER: 12, JUMLAH_FINTIPP: 12, JUMLAH_SCALPEL: 12,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 13) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 3900, BPW: 104, KIT_SALMONELLA: 13, PLASTIK_STOMACHER: 13, JUMLAH_FINTIPP: 13, JUMLAH_SCALPEL: 13,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 14) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 4200, BPW: 112, KIT_SALMONELLA: 14, PLASTIK_STOMACHER: 14, JUMLAH_FINTIPP: 14, JUMLAH_SCALPEL: 14,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 15) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_SALMONELLA',
          AQUADEST: 4500, BPW: 120, KIT_SALMONELLA: 15, PLASTIK_STOMACHER: 15, JUMLAH_FINTIPP: 15, JUMLAH_SCALPEL: 15,
          MIKROPIPETTE: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      }
    } else if (this.state.metodePengujianSampel === 'RT-PCR') {
      if (parseInt(this.state.jumlahSampel, 10) === 1) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 7.75, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 12.5, PRIMER_AL_F: 1, PRIMER_AL_R: 1, PROB_AL: 0.5, QUANTITECH_RT_MIX: 0.25, RNA_AVE: 5.6,
          BUFFER_AVL: 560, BUFFER_AW1: 500, BUFFER_AW2: 500, BUFFER_AVE: 60, ETHANOL_96_100: 560, TUBE_2ML: 4, QIACUBE: 1, FINTIPP: 6,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 2) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 15.5, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 25, PRIMER_AL_F: 2, PRIMER_AL_R: 2, PROB_AL: 1.0, QUANTITECH_RT_MIX: 0.50, RNA_AVE: 11.20,
          BUFFER_AVL: 1120, BUFFER_AW1: 1000, BUFFER_AW2: 500, BUFFER_AVE: 120, ETHANOL_96_100: 1120, TUBE_2ML: 8, QIACUBE: 1, FINTIPP: 12,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 3) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 23.5, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 38, PRIMER_AL_F: 3, PRIMER_AL_R: 3, PROB_AL: 1.5, QUANTITECH_RT_MIX: 0.75, RNA_AVE: 16.80,
          BUFFER_AVL: 1680, BUFFER_AW1: 1500, BUFFER_AW2: 1500, BUFFER_AVE: 180, ETHANOL_96_100: 1680, TUBE_2ML: 12, QIACUBE: 2, FINTIPP: 18,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 4) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 31, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 50, PRIMER_AL_F: 4, PRIMER_AL_R: 4, PROB_AL: 2.0, QUANTITECH_RT_MIX: 1.00, RNA_AVE: 22.40,
          BUFFER_AVL: 2240, BUFFER_AW1: 2000, BUFFER_AW2: 2000, BUFFER_AVE: 240, ETHANOL_96_100: 2240, TUBE_2ML: 16, QIACUBE: 3, FINTIPP: 24,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 5) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 38.75, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 63, PRIMER_AL_F: 5, PRIMER_AL_R: 5, PROB_AL: 2.5, QUANTITECH_RT_MIX: 1.25, RNA_AVE: 28.00,
          BUFFER_AVL: 2800, BUFFER_AW1: 2500, BUFFER_AW2: 2500, BUFFER_AVE: 300, ETHANOL_96_100: 2800, TUBE_2ML: 20, QIACUBE: 8, FINTIPP: 30,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 6) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 46.5, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 75, PRIMER_AL_F: 6, PRIMER_AL_R: 6, PROB_AL: 3.0, QUANTITECH_RT_MIX: 1.50, RNA_AVE: 33.60,
          BUFFER_AVL: 3360, BUFFER_AW1: 3000, BUFFER_AW2: 3000, BUFFER_AVE: 360, ETHANOL_96_100: 3360, TUBE_2ML: 24, QIACUBE: 23, FINTIPP: 36,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 7) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 54.25, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 88, PRIMER_AL_F: 7, PRIMER_AL_R: 7, PROB_AL: 3.5, QUANTITECH_RT_MIX: 1.75, RNA_AVE: 39.20,
          BUFFER_AVL: 3920, BUFFER_AW1: 3500, BUFFER_AW2: 3500, BUFFER_AVE: 420, ETHANOL_96_100: 3920, TUBE_2ML: 28, QIACUBE: 79, FINTIPP: 42,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 8) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 62, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 100, PRIMER_AL_F: 8, PRIMER_AL_R: 8, PROB_AL: 4.0, QUANTITECH_RT_MIX: 2.00, RNA_AVE: 44.80,
          BUFFER_AVL: 4480, BUFFER_AW1: 4000, BUFFER_AW2: 4000, BUFFER_AVE: 480, ETHANOL_96_100: 4480, TUBE_2ML: 32, QIACUBE: 315, FINTIPP: 48,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 9) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 69.75, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 113, PRIMER_AL_F: 9, PRIMER_AL_R: 9, PROB_AL: 4.5, QUANTITECH_RT_MIX: 2.25, RNA_AVE: 50.40,
          BUFFER_AVL: 5040, BUFFER_AW1: 4500, BUFFER_AW2: 4500, BUFFER_AVE: 540, ETHANOL_96_100: 5040, TUBE_2ML: 36, QIACUBE: 1418, FINTIPP: 54,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 10) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 77.5, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 125, PRIMER_AL_F: 10, PRIMER_AL_R: 10, PROB_AL: 5.0, QUANTITECH_RT_MIX: 2.50, RNA_AVE: 56.00,
          BUFFER_AVL: 5600, BUFFER_AW1: 5000, BUFFER_AW2: 5000, BUFFER_AVE: 600, ETHANOL_96_100: 5600, TUBE_2ML: 40, QIACUBE: 7088, FINTIPP: 60,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 11) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 85.25, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 138, PRIMER_AL_F: 11, PRIMER_AL_R: 11, PROB_AL: 5.5, QUANTITECH_RT_MIX: 2.75, RNA_AVE: 61.60,
          BUFFER_AVL: 6160, BUFFER_AW1: 5500, BUFFER_AW2: 5500, BUFFER_AVE: 660, ETHANOL_96_100: 6160, TUBE_2ML: 44, QIACUBE: 38981, FINTIPP: 66,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 12) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RT_PCR',
          RNASE_FREE_WATER: 93, QUANTITECT_PROB_RT_PCR_MASTER_MIX: 150, PRIMER_AL_F: 12, PRIMER_AL_R: 12, PROB_AL: 6.0, QUANTITECH_RT_MIX: 3.00, RNA_AVE: 67.20,
          BUFFER_AVL: 6720, BUFFER_AW1: 6000, BUFFER_AW2: 6000, BUFFER_AVE: 720, ETHANOL_96_100: 6720, TUBE_2ML: 48, QIACUBE: 233888, FINTIPP: 72,
          MIKROPIPETTE_100UL: 1, MIKROPIPETTE_10UL: 1, SPIN_DOWN: 1, VORTEX: 1, SENTRIFUGE: 1, PCR_HOOD: 1, ROTOR_GENE_Q: 2
        })
      }
    } else if (this.state.metodePengujianSampel === 'RAPID TEST KIT' && this.state.targetPengujianSampel === 'E. Coli') {
      if (parseInt(this.state.jumlahSampel, 10) === 1) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 300, BPW: 8, KIT_ECOLI: 1, PLASTIK_STOMACHER: 1, JUMLAH_FINTIPP: 1, JUMLAH_SCALPEL: 1,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 2) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 600, BPW: 16, KIT_ECOLI: 2, PLASTIK_STOMACHER: 2, JUMLAH_FINTIPP: 2, JUMLAH_SCALPEL: 2,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 3) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 900, BPW: 24, KIT_ECOLI: 3, PLASTIK_STOMACHER: 3, JUMLAH_FINTIPP: 3, JUMLAH_SCALPEL: 3,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 4) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 1200, BPW: 32, KIT_ECOLI: 4, PLASTIK_STOMACHER: 4, JUMLAH_FINTIPP: 4, JUMLAH_SCALPEL: 4,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 5) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 1500, BPW: 40, KIT_ECOLI: 5, PLASTIK_STOMACHER: 5, JUMLAH_FINTIPP: 5, JUMLAH_SCALPEL: 5,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 6) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 1800, BPW: 48, KIT_ECOLI: 6, PLASTIK_STOMACHER: 6, JUMLAH_FINTIPP: 6, JUMLAH_SCALPEL: 6,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 7) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 2100, BPW: 56, KIT_ECOLI: 7, PLASTIK_STOMACHER: 7, JUMLAH_FINTIPP: 7, JUMLAH_SCALPEL: 7,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 8) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 2400, BPW: 64, KIT_ECOLI: 8, PLASTIK_STOMACHER: 8, JUMLAH_FINTIPP: 8, JUMLAH_SCALPEL: 8,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 9) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 2700, BPW: 72, KIT_ECOLI: 9, PLASTIK_STOMACHER: 9, JUMLAH_FINTIPP: 9, JUMLAH_SCALPEL: 9,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 10) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 3000, BPW: 80, KIT_ECOLI: 10, PLASTIK_STOMACHER: 10, JUMLAH_FINTIPP: 10, JUMLAH_SCALPEL: 10,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 11) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 3300, BPW: 88, KIT_ECOLI: 11, PLASTIK_STOMACHER: 11, JUMLAH_FINTIPP: 11, JUMLAH_SCALPEL: 11,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 12) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 3600, BPW: 96, KIT_ECOLI: 12, PLASTIK_STOMACHER: 12, JUMLAH_FINTIPP: 12, JUMLAH_SCALPEL: 12,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 13) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 3900, BPW: 104, KIT_ECOLI: 13, PLASTIK_STOMACHER: 13, JUMLAH_FINTIPP: 13, JUMLAH_SCALPEL: 13,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 14) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 4200, BPW: 112, KIT_ECOLI: 14, PLASTIK_STOMACHER: 14, JUMLAH_FINTIPP: 14, JUMLAH_SCALPEL: 14,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 15) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'RTK_ECOLI',
          AQUADEST: 4500, BPW: 120, KIT_ECOLI: 15, PLASTIK_STOMACHER: 15, JUMLAH_FINTIPP: 15, JUMLAH_SCALPEL: 15,
          MIKROPIPETTE_100UL: 1, TIMBANGAN_ELEKTRIK: 1, STOMACHER: 1, HOT_PLATE_STIRER: 1, MICROWAVE: 1, GELAS_UKUR_1000ML: 1, PH_METER: 2, PINGSET: 1, GUNTING: 1, BUNSEN_SPIRTUS: 1
        })
      }
    } else if (this.state.metodePengujianSampel === 'PEWARNAAN GIEMSA') {
      if (parseInt(this.state.jumlahSampel, 10) === 1) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 9, BPW: 8, GIEMZA: 1, SLIDE: 1,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 2) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 9, BPW: 16, GIEMZA: 1, SLIDE: 2,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 3) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 9, BPW: 24, GIEMZA: 1, SLIDE: 3,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 4) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 9, BPW: 32, GIEMZA: 1, SLIDE: 4,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 5) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 9, BPW: 40, GIEMZA: 1, SLIDE: 5,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 6) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 13.5, BPW: 48, GIEMZA: 1.5, SLIDE: 6,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 7) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 13.5, BPW: 56, GIEMZA: 1.5, SLIDE: 7,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 8) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 13.5, BPW: 64, GIEMZA: 1.5, SLIDE: 8,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 9) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 13.5, BPW: 72, GIEMZA: 1.5, SLIDE: 9,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 10) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 13.5, BPW: 80, GIEMZA: 1.5, SLIDE: 10,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 11) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 18, BPW: 88, GIEMZA: 2, SLIDE: 11,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 12) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 18, BPW: 96, GIEMZA: 2, SLIDE: 12,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 13) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 18, BPW: 104, GIEMZA: 2, SLIDE: 13,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 14) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 18, BPW: 112, GIEMZA: 2, SLIDE: 14,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      } else if (parseInt(this.state.jumlahSampel, 10) === 15) {
        this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + a.key + '/bahan/' + b.key).update({
          idZItems: a.key, idPermohonanUji: this.state.idPermohonanUji, pengujian: 'PEWARNAAN_GIEMSA',
          AQUADEST: 18, BPW: 120, GIEMZA: 2, SLIDE: 15,
          PIPET_PASTEUR: 1, ETHANOL_96: 1, MIKROSKOPE: 1, OIL_EMERSION: 1
        })
      }
    }

    this.setState({
      kategoriSample: '',
      jenisSampel: '',
      jumlahSampel: '',
      kondisiSampel: '',
      jenisPengujianSampel: '',
      metodePengujianSampel: '',
      targetPengujianSampel: '',
      ruangLingkupSampel: '',
      keteranganSampel: '',
    });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      flagActivity: 'Data sudah lengkap',
    })
  }

  handleDelete = propSample => {
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji + '/zItems/' + propSample).remove();
    this.props.firebase.db.ref('bahanTerpakai/' + propSample).remove();
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
    if (name === 'kategoriSample') {
      this.props.firebase.db.ref('masterData/sample').orderByChild("kategoriSample").equalTo(event.target.value)
        .once("value", snap => {
          // console.log(snap.val())
          const a = [];
          a.push(snap.val());
          this.setState({
            selectJenisSampel: a[0],
          })
        })
      if (event.target.value === 'Bahan Asal Hewan' || event.target.value === 'Hasil Bahan Asal Hewan') {
        this.setState({
          selectMetodePengujian: ['TPC', 'RAPID TEST KIT'],
        })
      } else if (event.target.value === 'Ulas Darah') {
        this.setState({
          selectMetodePengujian: ['PEWARNAAN GIEMSA'],
        })
      } else if (event.target.value === 'Bahan Baku Pakan Ternak') {
        this.setState({
          selectMetodePengujian: ['PCR-DNA', 'RT-PCR', 'FEED CHECK'],
        })
      } else if (event.target.value === 'Swab') {
        this.setState({
          selectMetodePengujian: ['RT-PCR'],
        })
      }
    } else if (name === 'jenisSampel') {
      if (event.target.value === 'Serum Darah Sapi') {
        this.setState({
          selectMetodePengujian: ['RBT', 'ELISA BVD', 'ELISA PARATB'],
        })
      } else if (event.target.value === 'Serum Darah Kerbau' || event.target.value === 'Serum Darah Kambing') {
        this.setState({
          selectMetodePengujian: ['RBT', 'ELISA BVD'],
        })
      } else if (event.target.value === 'Serum Darah Anjing' || event.target.value === 'Serum Darah Kucing') {
        this.setState({
          selectMetodePengujian: ['ELISA RABIES'],
        })
      } else if (event.target.value === 'Serum Darah Ayam' || event.target.value === 'Serum Darah DOC' || event.target.value === 'Serum Darah Burung') {
        this.setState({
          selectMetodePengujian: ['HA-HI/AI-ND'],
        })
      } else if (event.target.value === 'Sarang Burung Walet') {
        this.setState({
          selectMetodePengujian: ['RESIDU NITRIT'],
        })
      } else if (event.target.value === 'Bakteri Kering') {
        this.setState({
          selectMetodePengujian: ['TPC'],
        })
      } else if (event.target.value === 'Serum Beku') {
        this.setState({
          selectMetodePengujian: ['RBT'],
        })
      } else if (event.target.value === 'Kerokan kulit') {
        this.setState({
          selectMetodePengujian: ['MIKROSKOPIS'],
        })
      }
    } else if (name === 'metodePengujianSampel') {
      if (event.target.value === 'TPC') {
        this.setState({
          selectTargetPengujian: ['Cemaran Mikroba'],
        })
      } else if (event.target.value === 'RAPID TEST KIT') {
        this.setState({
          selectTargetPengujian: ['Salmonella', 'E. Coli'],
        })
      } else if (event.target.value === 'HA-HI/AI-ND' || event.target.value === 'ELISA RABIES' || event.target.value === 'ELISA BVD' || event.target.value === 'ELISA PARATB') {
        this.setState({
          selectTargetPengujian: ['Titer Antibodi'],
        })
      } else if (event.target.value === 'RBT') {
        this.setState({
          selectTargetPengujian: ['Antibodi terhadap Brucella sp.'],
        })
      } else if (event.target.value === 'PEWARNAAN GIEMSA') {
        this.setState({
          selectTargetPengujian: ['Trypanosoma sp.', 'Anthrax'],
        })
      } else if (event.target.value === 'MIKROSKOPIS') {
        this.setState({
          selectTargetPengujian: ['Scabies'],
        })
      } else if (event.target.value === 'RT-PCR') {
        this.setState({
          selectTargetPengujian: ['Al', 'Anthrax'],
        })
      } else if (event.target.value === 'PCR-DNA') {
        this.setState({
          selectTargetPengujian: ['Porcine', 'Salmonella'],
        })
      } else if (event.target.value === 'RESIDU NITRIT') {
        this.setState({
          selectTargetPengujian: ['Kadar Nitrit'],
        })
      } else if (event.target.value === 'FEED CHECK') {
        this.setState({
          selectTargetPengujian: ['Kandungan Mamalia'],
        })
      }
    }
  };

  render() {
    const { kodeUnikSampel, tanggalMasukSampel, nomorAgendaSurat,
      namaPemilikSampel, alamatPemilikSampel, asalTujuanSampel, petugasPengambilSampel,
      jenisSampel, jumlahSampel, kondisiSampel, jenisPengujianSampel, metodePengujianSampel, kategoriSample, targetPengujianSampel,
      loading, items,
      selectJenisPengujian, selectMetodePengujian, selectJenisSampel, selectTargetPengujian, ruangLingkupSampel, keteranganSampel,
    } = this.state;
    const isInvalid = kodeUnikSampel === '' || tanggalMasukSampel === '' || nomorAgendaSurat === '' || namaPemilikSampel === '' ||
      alamatPemilikSampel === '' || asalTujuanSampel === '' || petugasPengambilSampel === '';
    const isInvalid2 = jenisSampel === '' || jumlahSampel === '' || kondisiSampel === '' || metodePengujianSampel === '' || kategoriSample === '' ||
      targetPengujianSampel === '';
    // console.log(items);

    return (
      <div>
        {loading ? <Typography>Loading...</Typography> :
          <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
              Ubah Data
            </Button>{' '}
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen2}>
              Tambah Item Pengujian
            </Button>{' '}
            {/* <PDFDownloadLink document={<Quixote q={items} />} fileName="permohonan-pengujian.pdf">
              {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download PDF!')}
            </PDFDownloadLink>{' '} */}
            <Button component={Link}
              to={{
                pathname: `${ROUTES.WILKER_FORMUJI}`,
              }}
            >
              BACK
            </Button>
            {!loading && items.map((el, key) =>
              <div style={{ marginTop: 25 }} key={key}>
                {/* <Typography variant="subtitle1" gutterBottom>Kode Unik Sample : {el.kodeUnikSampel}</Typography> */}
                <Typography variant="subtitle1" gutterBottom>Tanggal Masuk Sampel : {dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nomor Permohonan (IQFAST) : {el.nomorAgendaSurat}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nama Pemilik Sampel : {el.namaPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Alamat Pemilik Sampel : {el.alamatPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Asal/Tujuan Media Pembawa : {el.asalTujuanSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Petugas Pengambil Sampel (PPC) : {el.petugasPengambilSampel}</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Kategori Sampel</TableCell>
                      <TableCell>Jenis Sampel</TableCell>
                      <TableCell>Jumlah Sampel</TableCell>
                      <TableCell>Kondisi Sampel</TableCell>
                      <TableCell>Metode Pengujian</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!!el.zItems && Object.keys(el.zItems).map((el1, key1) =>
                      <TableRow key={key1}>
                        <TableCell>{el.zItems[el1].kategoriSample}</TableCell>
                        <TableCell>{el.zItems[el1].jenisSampel}</TableCell>
                        <TableCell>{el.zItems[el1].jumlahSampel}</TableCell>
                        <TableCell>{el.zItems[el1].kondisiSampel}</TableCell>
                        <TableCell>{el.zItems[el1].metodePengujianSampel}</TableCell>
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
                {/* <TextField
                  disabled
                  margin="dense"
                  id="kodeUnikSampel"
                  label="Kode Unik Sampel"
                  value={kodeUnikSampel}
                  onChange={this.onChange('kodeUnikSampel')}
                  fullWidth
                /> */}
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin="normal"
                    style={{ width: 250 }}
                    label="Tanggal Masuk Sampel"
                    value={tanggalMasukSampel}
                    format={'MM/dd/yyyy'}
                    onChange={this.handleDateChange} />
                </MuiPickersUtilsProvider>
                <TextField
                  autoFocus
                  margin="dense"
                  id="nomorAgendaSurat"
                  label="Nomor Permohonan (IQFAST)"
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
                  label="Asal/Tujuan Media Pembawa"
                  value={asalTujuanSampel}
                  onChange={this.onChange('asalTujuanSampel')}
                  fullWidth
                />
                <TextField
                  disabled
                  margin="dense"
                  id="petugasPengambilSampel"
                  label="Petugas Pengambil Sampel (PPC)"
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
                  <InputLabel htmlFor="kategoriSample">Kategori Sampel</InputLabel>{" "}
                  <Select
                    value={kategoriSample}
                    onChange={this.onChange2('kategoriSample')}
                    style={{ width: 400 }}
                    name="kategoriSample"
                  >
                    <MenuItem value="Bahan Asal Hewan">Bahan Asal Hewan</MenuItem>
                    <MenuItem value="Hasil Bahan Asal Hewan">Hasil Bahan Asal Hewan</MenuItem>
                    <MenuItem value="Serum">Serum</MenuItem>
                    <MenuItem value="Ulas Darah">Ulas Darah</MenuItem>
                    <MenuItem value="Bahan Baku Pakan Ternak">Bahan Baku Pakan Ternak</MenuItem>
                    <MenuItem value="Swab">Swab</MenuItem>
                    <MenuItem value="Lain-lain">Lain-lain</MenuItem>
                  </Select>
                </FormControl>
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="jenisSampel">Jenis Sampel</InputLabel>
                  <Select
                    value={jenisSampel}
                    onChange={this.onChange2('jenisSampel')}
                    style={{ width: 400 }}
                    name="jenisSampel"
                  >
                    {!!selectJenisSampel && Object.keys(selectJenisSampel).map(elx1 =>
                      <MenuItem key={elx1} value={selectJenisSampel[elx1].namaSample}>{selectJenisSampel[elx1].namaSample}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                <TextField
                  style={{ marginTop: 15, width: 400 }}
                  margin="dense"
                  id="jumlahSampel"
                  label="Jumlah Sampel"
                  value={jumlahSampel}
                  onChange={this.onChange2('jumlahSampel')}
                  fullWidth
                />
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="kondisiSampel">Kondisi Sampel</InputLabel>{" "}
                  <Select
                    value={kondisiSampel}
                    onChange={this.onChange2('kondisiSampel')}
                    style={{ width: 400 }}
                    name="kondisiSampel"
                  >
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Tidak Normal">Tidak Normal</MenuItem>
                  </Select>
                </FormControl>
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="metodePengujianSampel">Metode Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={metodePengujianSampel}
                    onChange={this.onChange2('metodePengujianSampel')}
                    style={{ width: 400 }}
                    name="metodePengujianSampel"
                  >
                    {
                      !!selectMetodePengujian && selectMetodePengujian.map((elx, key) =>
                        <MenuItem key={key} value={elx}>{elx}</MenuItem>
                      )
                    }
                  </Select>
                </FormControl>
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="targetPengujianSampel">Target Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={targetPengujianSampel}
                    onChange={this.onChange2('targetPengujianSampel')}
                    name="targetPengujianSampel"
                    style={{ width: 400 }}
                  >
                    {!!selectTargetPengujian && selectTargetPengujian.map((elx, key) =>
                      <MenuItem key={key} value={elx}>{elx}</MenuItem>
                    )}
                  </Select>
                </FormControl>
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="ruangLingkupSampel">Ruang Lingkup Sampel</InputLabel>{" "}
                  <Select
                    value={ruangLingkupSampel}
                    onChange={this.onChange2('ruangLingkupSampel')}
                    style={{ width: 400 }}
                    name="ruangLingkupSampel"
                  >
                    <MenuItem value="Akreditasi">Akreditasi</MenuItem>
                    <MenuItem value="Diluar Akreditasi">Diluar Akreditasi</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  style={{ marginTop: 15, width: 400 }}
                  margin="dense"
                  id="keteranganSampel"
                  label="Keterangan Sampel"
                  value={keteranganSampel}
                  onChange={this.onChange2('keteranganSampel')}
                  fullWidth
                />
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
        }
      </div>
    )
  }

}

// *********************************************** begin PDF part
const styles = StyleSheet.create({
  body: {
    padding: 10
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCellHeader: {
    margin: "auto",
    margin: 3,
    fontSize: 10,
    fontWeight: 300
  },
  tableCell: {
    margin: "auto",
    margin: 5,
    fontSize: 10
  },
  headerRow: {
    margin: 5,
    flexDirection: "row",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomWidth: 2,
  },
  headerTitle10: {
    fontSize: 10,
  },
  headerTitle11: {
    fontSize: 11,
  },
  headerTitle16: {
    fontSize: 16,
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 3,
  },
  logo: {
    marginVertical: 3,
    marginHorizontal: 3,
    width: 40,
    height: 40,
  },
  headerRowRight: {
    textAlign: 'right',
    fontSize: 11,
  },
  headerRowCenter: {
    textAlign: 'center',
    marginVertical: 15,
  },
  marginV10: {
    marginVertical: 10,
  },
  tableHeaderCol5: {
    width: "5%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableHeaderCol20: {
    width: "20%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableHeaderCol15: {
    width: "15%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableHeaderCol40: {
    width: "40%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomWidth: 0
  },
  tableHeaderCol60: {
    width: "60%",
    borderStyle: "solid",
    borderColor: '#000',
    borderBottomColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  tableCol5: {
    width: "5%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol10: {
    width: "10%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol15: {
    width: "15%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCol20: {
    width: "20%",
    borderStyle: "solid",
    borderColor: '#000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  footerRow: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: '20%',
  },
  footerRow2: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
  },
  footerRow100: {
    position: 'absolute',
    bottom: 100,
    marginHorizontal: '20%',
  },
  footerRow200: {
    position: 'absolute',
    bottom: 200,
    marginHorizontal: '20%',
  },
  footerCol: {
    alignItems: 'center',
    fontSize: 11,
    // marginHorizontal: 100,
  },
  spaceV400: {
    width: 400,
    height: 5,
  },
  spaceV150: {
    width: 150,
    height: 5,
  }
});

const Quixote = (p) => {
  console.log(p);

  return <Document>
    <Page size='LEGAL' orientation='landscape' style={styles.body}>
      <View style={styles.headerRow}>
        <Image
          style={styles.logo}
          src='data:image/png;base64,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'
        />
        <View>
          <Text style={styles.headerTitle10}>BALAI BESAR KARANTINA PERTANIAN MAKASSAR</Text>
          <Text style={styles.headerTitle10}>LABORATORIUM</Text>
          <Text style={styles.headerTitle10}>Jl. Kapasa Raya No. 17 Km. 14 Daya, Makassar</Text>
          <Text style={styles.headerTitle10}>Telp. : 0411-510 041 Fax : 0411-516 351, Email : labbbkpmakassar@gmail.com</Text>
        </View>
      </View>
      <View style={styles.headerRowRight}>
        <Text>Form No : 5.4.7.1.1</Text>
      </View>
      <View style={styles.headerRowCenter}>
        <Text style={styles.headerTitle16}>PERMOHONAN PENGUJIAN</Text>
        <Text style={styles.headerTitle11}>Nomor : {p.q.nomorAgendaSurat} {'   '}Tanggal : {dateFnsFormat(new Date(p.q.tanggalMasukSampel), "MM/dd/yyyy")}</Text>
      </View>
      <View style={styles.marginV10}>
        <Text style={styles.headerTitle11}>Tanggal Penerimaan Sampel : {dateFnsFormat(new Date(), "MM/dd/yyyy")}</Text>
        <Text style={styles.headerTitle11}>Nama Customer : {p.q.namaPemilikSampel}</Text>
        <Text style={styles.headerTitle11}>Alamat dan No Tlp Customer : {p.q.alamatPemilikSampel}</Text>
        <Text style={styles.headerTitle11}>Asal/Tujuan Sampel: {p.q.asalTujuanSampel}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableHeaderCol5}>
            <Text style={styles.tableCellHeader}>No</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Jenis Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Jumlah Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Kondisi Sampel</Text>
            <View style={styles.footerRow2}>
              <View style={styles.tableHeaderCol40}>
                <Text style={styles.tableCellHeader}>Normal</Text>
              </View>
              <View style={styles.tableHeaderCol60}>
                <Text style={styles.tableCellHeader}>Tidak Normal</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Jenis Pengujian</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Ruang Lingkup</Text>
            <View style={styles.footerRow2}>
              <View style={styles.tableHeaderCol40}>
                <Text style={styles.tableCellHeader}>Akreditasi</Text>
              </View>
              <View style={styles.tableHeaderCol60}>
                <Text style={styles.tableCellHeader}>Diluar Akreditasi</Text>
              </View>
            </View>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Keterangan</Text>
          </View>
        </View>
        {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) =>
          <View style={styles.tableRow}>
            <View style={styles.tableCol5}>
              <Text style={styles.tableCell}>{key1 + 1}</Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jenisSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jumlahSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].kondisiSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].metodePengujianSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].ruangLingkupSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].keteranganSampel}</Text>
            </View>
          </View>
        )}

      </View>
      <View style={styles.footerRow}>
        <View style={styles.footerRow2}>
          <View style={styles.footerCol}>
            <Text>Penerima Sampel</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>(...................)</Text>
          </View>
          <View style={styles.spaceV400}></View>
          <View style={styles.footerCol}>
            <Text>Petugas Pengambil Sampel, {dateFnsFormat(new Date(p.q.tanggalMasukSampel), "MM/dd/yyyy")}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>( {p.q.petugasPengambilSampel} )</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
}

const PDFLHU = (p) => {
  console.log(p);

  return <Document>
    <Page size='LEGAL' orientation='portrait' style={styles.body}>
      <View style={styles.headerRow}>
        <Image
          style={styles.logo}
          src='data:image/png;base64,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'
        />
        <View>
          <Text style={styles.headerTitle10}>BALAI BESAR KARANTINA PERTANIAN MAKASSAR</Text>
          <Text style={styles.headerTitle10}>LABORATORIUM</Text>
          <Text style={styles.headerTitle10}>Jl. Kapasa Raya No. 17 Km. 14 Daya, Makassar</Text>
          <Text style={styles.headerTitle10}>Telp. : 0411-510 041 Fax : 0411-516 351, Email : labbbkpmakassar@gmail.com</Text>
        </View>
      </View>
      <View style={styles.headerRowRight}>
        <Text>Form No : 5.4.4.2</Text>
      </View>
      <View style={styles.headerRowCenter}>
        <Text style={styles.headerTitle16}>LAPORAN HASIL UJI SEROLOGI</Text>
      </View>
      <View style={[styles.marginV10, styles.marginL20]}>
        <Text style={styles.headerTitle11}>Laporan / Sertifikat ini diberikan kepada :</Text>
      </View>
      <View style={[styles.marginV10, styles.marginL40]}>
        <Text style={styles.headerTitle11}>Nama / Instansi Pemilik Sampel : {p.q.namaPemilikSampel}</Text>
        <Text style={styles.headerTitle11}>Alamat : {p.q.alamatPemilikSampel}</Text>
        <Text style={styles.headerTitle11}>Ket. Asal / Tujuan : {p.q.asalTujuanSampel}</Text>
      </View>
      <View style={[styles.marginV10, styles.marginL20]}>
        <Text style={styles.headerTitle11}>Yang telah mengirim sampel untuk pengujian Laboratorium, Identitas sampel, jenis dan hasil pengujian sebagai berikut : </Text>
      </View>
      {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) =>
        <View style={[styles.marginV10, styles.marginL40]}>
          <Text style={styles.headerTitle11}>Sampel (jenis dan jumlah) : {p.q.zItems[el1].jenisSampel} / {p.q.zItems[el1].jumlahSampel}</Text>
          <Text style={styles.headerTitle11}>No. Identifikasi Sampel : {p.q.kodeUnikSampelAdminLab}</Text>
          <Text style={styles.headerTitle11}>No. Surat Pengiriman : {p.q.nomorAgendaSurat}</Text>
          <Text style={styles.headerTitle11}>Tanggal Pengiriman Surat : {dateFnsFormat(new Date(p.q.tanggalMasukSampel), "MM/dd/yyyy")}</Text>
          <Text style={styles.headerTitle11}>Tanggal Penerimaan Sampel : {dateFnsFormat(p.q.tanggalTerimaSampelAdminLab === undefined ? new Date() : new Date(p.q.tanggalTerimaSampelAdminLab), "MM/dd/yyyy")}</Text>
          <Text style={styles.headerTitle11}>Jenis Pengujian : {p.q.unitPengujianSampel}</Text>
          <Text style={styles.headerTitle11}>Tanggal Pengujian : {dateFnsFormat(p.q.tanggalUjiSampelAnalis === undefined ? new Date() : new Date(p.q.tanggalUjiSampelAnalis), "MM/dd/yyyy")}</Text>
          <Text style={styles.headerTitle11}>Kondisi Sampel : {p.q.zItems[el1].kondisiSampel}</Text>
        </View>
      )}
      <View style={styles.headerRowCenter}>
        <Text style={styles.headerTitle16}>HASIL</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Jenis Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Jumlah Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Jenis Pemeriksaan</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Metode Pemeriksaan</Text>
          </View>
          <View style={styles.tableHeaderCol15}>
            <Text style={styles.tableCellHeader}>Hasil Uji</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Keterangan</Text>
          </View>
        </View>
        {!!p.q.zItems && Object.keys(p.q.zItems).map((el1, key1) =>
          <View style={styles.tableRow}>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jenisSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jumlahSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].targetPengujianSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].metodePengujianSampel}</Text>
            </View>
            <View style={styles.tableCol15}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampel}</Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].keteranganSampel}</Text>
            </View>
          </View>
        )}
      </View>
      <Text>{' '}</Text>
      <View style={styles.headerTitle10}><Text>Keterangan: {p.q.formLaporanKeterangan}</Text></View>
      <Text>{' '}</Text>
      <View style={styles.headerTitle10}><Text>Kesimpulan: {p.q.formLaporanKesimpulan}</Text></View>
      <View style={styles.footerRow200}>
        <View style={styles.footerRow2}>
          <View style={styles.footerCol}>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Image
              style={styles.logo}
              src='data:image/png;base64,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'
            />
          </View>
          <View style={styles.spaceV150}></View>
          <View style={styles.footerCol}>
            <Text style={[styles.headerTitle11]}>Makassar, {dateFnsFormat(p.q.tanggalUjiSampelAnalis === undefined ? new Date() : new Date(p.q.tanggalUjiSampelAnalis), "MM/dd/yyyy")}</Text>
            <Text>{' '}</Text>
            <Text style={[styles.headerTitle11, styles.headerRowLeft]}>Mengetahui,</Text>
            <Text>Pelaksana Fungsi</Text>
            <Text>Manajer Teknis</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>( {p.q.manajerTeknisAdminLab})</Text>
          </View>
        </View>
      </View>
      <View style={styles.footerRow100}>
        <View style={[styles.marginV10, styles.marginL20]}>
          <Text style={styles.headerTitle11}>Nb:</Text>
        </View>
        <View style={[styles.marginV10, styles.marginL40]}>
          <Text style={styles.headerTitle11}>Hasil hanya berlaku untuk sampel yang diuji</Text>
        </View>
      </View>
    </Page>
  </Document>
}

// *********************************************** end PDF part


const condition = authUser => !!authUser;

const SampelAll = withFirebase(SampelAllBase);
const SampelDetail = withFirebase(SampelDetailBase);
const SampelAdd = withFirebase(SampelAddBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);