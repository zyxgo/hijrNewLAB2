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
          <Typography variant="h5" gutterBottom>
            Pelaksana Fungsi Teknis Page
          </Typography>
          <Switch>
            <Route exact path={ROUTES.TEKNIS_DETAILS} component={PageDetail} />
            <Route exact path={ROUTES.TEKNIS} component={PageAll} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}


///////////////////////////// VIEW ALL DATA
class PageAllBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      formMode: [],
      items2: '',
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples')
      // .orderByChild('flagStatusProses')
      // .equalTo('Proses di Pelaksana Teknis')
      .on('value', snap => {
        if (snap.val()) {
          const a = [];
          snap.forEach(el => {
            if ( el.val().flagStatusProses !== 'Sampel tidak dapat diuji') 
            {a.push({
              idPermohonanUji: el.val().idPermohonanUji,
              kodeUnikSampel: el.val().kodeUnikSampel,
              tanggalMasukSampel: el.val().tanggalMasukSampel,
              nomorAgendaSurat: el.val().nomorAgendaSurat,
              namaPemilikSampel: el.val().namaPemilikSampel,
              alamatPemilikSampel: el.val().alamatPemilikSampel,
              asalTujuanSampel: el.val().asalTujuanSampel,
              petugasPengambilSampel: el.val().petugasPengambilSampel,
              flagActivity: el.val().flagActivity,
              flagActivityDetail: el.val().flagActivityDetail,
              flagStatusProses: el.val().flagStatusProses,
              kodeUnikSampelAdminLab: el.val().kodeUnikSampelAdminLab,
              nomorAgendaSurat: el.val().nomorAgendaSurat,
              tanggalTerimaSampelAdminLab: el.val().tanggalTerimaSampelAdminLab,
              unitPengujianSampel: el.val().unitPengujianSampel,
              tanggalUjiSampelAnalis: el.val().tanggalUjiSampelAnalis,
              kondisiSampel: el.val().kondisiSampel,
              manajerAdministrasiAdminLab: el.val().manajerAdministrasiAdminLab,
              manajerTeknisAdminLab: el.val().manajerTeknisAdminLab,
              nipManajerTeknisAdminLab: el.val().nipManajerTeknisAdminLab,
              penyeliaAnalis: el.val().penyeliaAnalis,
              nipPenyeliaAnalis: el.val().nipPenyeliaAnalis,
              penerimaSampelAnalisLab: el.val().penerimaSampelAnalisLab,
              nipPenerimaSampelAnalisLab: el.val().nipPenerimaSampelAnalisLab,
              zItems: el.val().zItems,
            })}
          });
          this.setState({
            items: a,
            items2: snap.val(),
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

  handleSubmitLhuOk = propSample => {
    this.props.firebase.db.ref('samples/' + propSample).update({
      flagActivity: 'Laporan Hasil Uji di Admin Lab',
      flagActivityDetail: 'Laporan Hasil Uji di Admin Lab',
      flagStatusProses: 'Laporan Hasil Uji di Admin Lab'
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
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nomor Permohonan (IQFAST)</TableCell>
                      <TableCell>Tanggal Masuk Sampel</TableCell>
                      <TableCell>Nama Pemilik Sampel</TableCell>
                      <TableCell>Asal/Tujuan Media Pembawa</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell colSpan={2}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && !!items && items.map((el, key) =>
                    <TableBody key={key}>
                      <TableRow>
                        <TableCell>{el.nomorAgendaSurat}</TableCell>
                        <TableCell>{dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</TableCell>
                        <TableCell>{el.namaPemilikSampel}</TableCell>
                        <TableCell>{el.asalTujuanSampel}</TableCell>
                        <TableCell>{el.flagStatusProses}</TableCell>
                        <TableCell>
                          <Button component={Link}
                            to={{
                              pathname: `${ROUTES.TEKNIS}/${el.idPermohonanUji}`,
                              data: { el },
                            }}
                            disabled={el.flagStatusProses === "Proses di Pelaksana Teknis" ? false : true}
                          >
                            Detail
                          </Button>
                        </TableCell>
                        {/* <TableCell>
                          <PDFDownloadLink document={<PDFLHU q={el} />} fileName="laporan-hasil-uji.pdf">
                            {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Laporan Hasil Uji')}
                          </PDFDownloadLink>
                        </TableCell> */}
                        <TableCell>
                          {el.flagStatusProses === 'Proses di Pelaksana Teknis' || el.flagStatusProses === 'Laporan Hasil Uji di Admin Lab' ?
                            <PDFDownloadLink document={<PdfLHP q={el} />} fileName="laporan-hasil-uji.pdf">
                              {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Laporan Hasil Pengujian')}
                            </PDFDownloadLink>
                            :
                            'Laporan Hasil Pengujian belum tersedia.'
                          }
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" color="primary" onClick={() => this.handleSubmitLhuOk(el.idPermohonanUji)}
                            disabled={el.flagActivityDetail === "Update keterangan by manajer teknis done" ? false : true}
                          >
                            Laporan Hasil Uji OK
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </div>
            }
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }

}

///////////////////////////// UBAH DATA
class PageDetailBase extends Component {
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
      kodeUnikSampelAdminLab: '',
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
      unitPengujian: '',
      selectJenisPengujian: [],
      selectMetodePengujian: [],
      selectUnitPengujian: [],
      tanggalTerimaSampelAdminLab: new Date(),
      penerimaSampelAdminLab: '',
      penerimaSampelAnalisLab: '',
      manajerTeknisAdminLab: '',
      manajerAdministrasiAdminLab: '',
      thisP: '',
      thisQ: '',
      formLaporanKeterangan: '',
      formLaporanKesimpulan: '',
    };
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples/' + this.props.match.params.id)
      .on('value', snap => {
        if (snap.val()) {
          const a = [];
          a.push(snap.val());
          this.setState({
            items: a,
            loading: false,
            idPermohonanUji: snap.val().idPermohonanUji,
            kodeUnikSampel: snap.val().kodeUnikSampel,
            tanggalMasukSampel: snap.val().tanggalMasukSampel,
            // kodeUnikSampelAdminLab: snap.val().kodeUnikSampelAdminLab,
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
          const b2 = [];
          const b3 = [];
          const b4 = [];
          snap1.forEach((res) => {
            if (res.val().jabatanUserForm === 'Admin Lab') {
              b1.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            } else if (res.val().jabatanUserForm === 'Manajer Administrasi') {
              b2.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            } else if (res.val().jabatanUserForm === 'Manajer Teknis') {
              b3.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            } else if (res.val().jabatanUserForm === 'Analis') {
              b4.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            }
          })
          this.setState({
            selectUserformAdminLab: b1,
            selectUserformManajerAdministrasi: b2,
            selectUserformManajerTeknis: b3,
            selectUserformAnalis: b4,
          });
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

  handleClickOpen2 = () => {
    this.setState({ open2: true });
  };

  handleClose2 = () => {
    this.setState({ open2: false, unitPengujianSampel: '' });
  };

  handleSubmit = () => {
    this.setState({ open: false });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      formLaporanKeterangan: this.state.formLaporanKeterangan,
      formLaporanKesimpulan: this.state.formLaporanKesimpulan,
    });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      flagActivityDetail: 'Update keterangan by manajer teknis done',
    })
  }

  handleSubmit2 = () => {
    this.setState({ open2: false });
    this.props.firebase.db.ref('samples/' + this.state.thisP + '/zItems/' + this.state.thisQ).update({
      unitPengujianSampel: this.state.unitPengujianSampel,
    })
    this.props.firebase.db.ref('samples/' + this.state.thisP).update({
      flagActivityDetail: 'Update detail by admin lab done',
    })
  }

  handleUbah2 = (p, q, r) => {
    this.setState({ open2: true });
    if (r === 'TPC' || r === 'RAPID TEST KIT') {
      this.setState({
        selectUnitPengujian: ['Mikrobiologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'HA-HI/AI-ND') {
      this.setState({
        selectUnitPengujian: ['Virologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'ELISA RABIES' || r === 'ELISA BVD' || r === 'ELISA PARATB' || r === 'RBT') {
      this.setState({
        selectUnitPengujian: ['Serologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'PEWARNAAN GIEMSA' || r === 'MIKROSKOPIS') {
      this.setState({
        selectUnitPengujian: ['Parasitologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'RT-PCR' || r === 'RT-DNA') {
      this.setState({
        selectUnitPengujian: ['Biomolekuler'],
        thisP: p, thisQ: q
      })
    } else if (r === 'RESIDU NITRIT' || r === 'FEED CHECK') {
      this.setState({
        selectUnitPengujian: ['PSAH'],
        thisP: p, thisQ: q
      })
    }
  }

  handleDateChange = date => {
    this.setState({ tanggalTerimaSampelAdminLab: date });
  };

  // onChange = id => event => {
  //   this.setState({
  //     [id]: event.target.value,
  //   });
  // };

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onChange2 = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const {
      selectUnitPengujian, unitPengujianSampel, loading, items,
      formLaporanKeterangan, formLaporanKesimpulan,
    } = this.state;
    const isInvalid = formLaporanKeterangan === '' || formLaporanKesimpulan === '';
    const isInvalid2 = unitPengujianSampel === '';
    // console.log(this.state)

    return (
      <div>
        {loading ? <Typography>Loading...</Typography> :
          <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
              TAMBAH Keterangan
            </Button>{' '}
            <Button component={Link}
              to={{
                pathname: `${ROUTES.TEKNIS}`,
              }}
            >
              BACK
            </Button>
            {!loading && items.map((el, key) =>
              <div style={{ marginTop: 25 }} key={key}>
                {/* <Typography variant="subtitle1" gutterBottom>Nomor Permohonan (IQFAST) : {el.kodeUnikSampel}</Typography> */}
                <Typography variant="subtitle1" gutterBottom>Tanggal Masuk Sampel : {dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nomor Permohonan (IQFAST) : {el.nomorAgendaSurat}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nama Pemilik Sampel : {el.namaPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Alamat Pemilik Sampel : {el.alamatPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Asal/Tujuan Media Pembawa : {el.asalTujuanSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Petugas Pengambil Sampel (PPC) : {el.petugasPengambilSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Unit Pengujian Sampel : {el.unitPengujianSampel}</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Jenis Sampel</TableCell>
                      <TableCell>Jumlah Sampel</TableCell>
                      <TableCell>Kondisi Sampel</TableCell>
                      <TableCell>Metode Pengujian</TableCell>
                      <TableCell>Target Pengujian</TableCell>
                      <TableCell>Hasil Pengujian</TableCell>
                      {/* <TableCell>Unit Pengujian</TableCell> */}
                      {/* <TableCell>Action</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!!el.zItems && Object.keys(el.zItems).map((el1, key1) =>
                      <TableRow key={key1}>
                        <TableCell>{el.zItems[el1].jenisSampel}</TableCell>
                        <TableCell>{el.zItems[el1].jumlahSampel}</TableCell>
                        <TableCell>{el.zItems[el1].kondisiSampel}</TableCell>
                        <TableCell>{el.zItems[el1].metodePengujianSampel}</TableCell>
                        <TableCell>{el.zItems[el1].targetPengujianSampel}</TableCell>
                        <TableCell>{el.zItems[el1].hasilUjiSampel}</TableCell>
                        {/* <TableCell>{el.zItems[el1].unitPengujianSampel}</TableCell> */}
                        {/* <TableCell>
                          <Button variant="text" color="secondary" onClick={() => this.handleUbah2(el.idPermohonanUji, el1, el.zItems[el1].metodePengujianSampel)}>
                            Ubah
                          </Button>
                        </TableCell> */}
                        {/* <TableCell>
                          <PDFDownloadLink document={<Quixote q={el} />} fileName="form-permohonan-pengujian.pdf">
                            {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Permohonan Pengujian')}
                          </PDFDownloadLink>
                        </TableCell> */}
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
              maxWidth={'md'}
              fullWidth={true}
            >
              <DialogTitle id="form-dialog-title">Tambah Keterangan oleh Manajer Teknis</DialogTitle>
              <DialogContent>
                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin="normal"
                    style={{ width: 350, marginBottom: 20 }}
                    label="Tanggal Terima Sampel oleh Admin Lab"
                    value={tanggalTerimaSampelAdminLab}
                    format={'MM/dd/yyyy'}
                    onChange={this.handleDateChange} />
                </MuiPickersUtilsProvider> */}

                <TextField
                  id="formLaporanKeterangan"
                  label="Keterangan Laporan"
                  style={{ width: "100%", marginBottom: 20, marginTop: 20 }}
                  variant="outlined"
                  onChange={this.onChange}
                />
                <TextField
                  id="formLaporanKesimpulan"
                  label="Kesimpulan Laporan"
                  style={{ width: "100%", marginBottom: 20 }}
                  variant="outlined"
                  onChange={this.onChange}
                />
                {/* <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="unitPengujianSampel">Unit Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={unitPengujianSampel}
                    onChange={this.onChange2('unitPengujianSampel')}
                    name="unitPengujianSampel"
                    style={{ width: 400 }}
                  >
                    <MenuItem value="Mikrobiologi">Mikrobiologi</MenuItem>
                    <MenuItem value="Virologi">Virologi</MenuItem>
                    <MenuItem value="Serologi">Serologi</MenuItem>
                    <MenuItem value="Parasitologi">Parasitologi</MenuItem>
                    <MenuItem value="Biomolekuler">Biomolekuler</MenuItem>
                    <MenuItem value="PSAH">PSAH</MenuItem>
                  </Select>
                </FormControl> */}
                {/* <TextField
                  id="penerimaSampelAdminLab"
                  label="Admin Lab"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                {/* <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="penerimaSampelAdminLab">Admin Lab</InputLabel>{" "}
                  <Select
                    value={penerimaSampelAdminLab}
                    onChange={this.onChange2('penerimaSampelAdminLab')}
                    style={{ width: 400 }}
                    name="penerimaSampelAdminLab"
                  >
                    {!!selectUserformAdminLab && Object.keys(selectUserformAdminLab).map((el) =>
                      <MenuItem key={el} value={selectUserformAdminLab[el].namaUserForm}>{selectUserformAdminLab[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl> */}
                {/* <TextField
                  id="manajerAdministrasiAdminLab"
                  label="Manajer Administrasi"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                {/* <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="manajerAdministrasiAdminLab">Manajer Administrasi</InputLabel>{" "}
                  <Select
                    value={manajerAdministrasiAdminLab}
                    onChange={this.onChange2('manajerAdministrasiAdminLab')}
                    style={{ width: 400 }}
                    name="manajerAdministrasiAdminLab"
                  >
                    {!!selectUserformManajerAdministrasi && Object.keys(selectUserformManajerAdministrasi).map((el) =>
                      <MenuItem key={el} value={selectUserformManajerAdministrasi[el].namaUserForm}>{selectUserformManajerAdministrasi[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl> */}
                {/* <TextField
                  id="manajerTeknisAdminLab"
                  label="Manajer Teknis"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                {/* <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="manajerTeknisAdminLab">Manajer Teknis</InputLabel>{" "}
                  <Select
                    value={manajerTeknisAdminLab}
                    onChange={this.onChange2('manajerTeknisAdminLab')}
                    style={{ width: 400 }}
                    name="manajerTeknisAdminLab"
                  >
                    {!!selectUserformManajerTeknis && Object.keys(selectUserformManajerTeknis).map((el) =>
                      <MenuItem key={el} value={selectUserformManajerTeknis[el].namaUserForm}>{selectUserformManajerTeknis[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl> */}
                {/* <TextField
                  id="penerimaSampelAnalisLab"
                  label="Analis"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                {/* <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="penerimaSampelAnalisLab">Analis</InputLabel>{" "}
                  <Select
                    value={penerimaSampelAnalisLab}
                    onChange={this.onChange2('penerimaSampelAnalisLab')}
                    style={{ width: 400 }}
                    name="penerimaSampelAnalisLab"
                  >
                    {!!selectUserformAnalis && Object.keys(selectUserformAnalis).map((el) =>
                      <MenuItem key={el} value={selectUserformAnalis[el].namaUserForm}>{selectUserformAnalis[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl> */}
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
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Update Unit Pengujian Sampel</DialogTitle>
              <DialogContent>
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="unitPengujianSampel">Unit Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={unitPengujianSampel}
                    onChange={this.onChange2('unitPengujianSampel')}
                    name="unitPengujianSampel"
                    style={{ width: 400 }}
                  >
                    {!!selectUnitPengujian && selectUnitPengujian.map((elx, key) =>
                      <MenuItem key={key} value={elx}>{elx}</MenuItem>
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
  headerRowLeft: {
    textAlign: 'left',
    fontSize: 11,
  },
  headerRowCenter: {
    textAlign: 'center',
    marginVertical: 15,
  },
  marginV10: {
    marginVertical: 10,
  },
  marginL20: {
    marginLeft: 20,
  },
  marginL40: {
    marginLeft: 40,
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
  footerRow2: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
  },
  footerRow: {
    position: 'absolute',
    bottom: 20,
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
  },
  textUnderline: {
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
});

const PDFLHU = (p) => {
  console.log(p);

  return <Document>
    <Page size='LEGAL' orientation='portrait' style={styles.body}>
      <View style={styles.headerRow}>
        <Image
          style={styles.logo}
          src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABUFBMVEX////6px0BOCH+/v4AAAD6owD///0kICH6pAD9/f76phj8//8lIiP/qh36oQAiHh8ANCEAMiEANBwAMBYbFhcAKAD19fYAJQAAKQAIAAAALxQBOSEALyEaFRby8vPExcYAKwwSDA21trfg4eL+79XR0tPNzs/+6cfwpR9cXF6CgoRsbG5GRUba29ytrq/+9eS7vL2ZmpszMjT8zoj7v2H506JLSkw+PT+MjY7/+/P7vFX94bN2dngrKSufoKLroR4AIQD7tUL8z5n8yXcAGwDRliCltawtVz9hYGL95bz7szuvhSH8xW+KcyFlWiB5ayHBzMRshndCUyIAPRyuvbPIkiAoRyL7xH2FmY1phHNbXiL92J8ANxRGZlMfTDSWqJxScV4pUzsAEwASSCxTbF9MUiGbfCFvYiAgQyG4iiH8z4PO2dAfUTY0VEKLmpJhdmzVEIJEAAAgAElEQVR4nM1d+V/bxraXkSws2djEGIMhFhay8YZtFuMNm4TQsDi0IYUmUCDQS7cbbl///9/eOSPNIlleSJO2896nl4As66uzL3NGkr720rSwZBhJ/DGbzePKZtv4e8MIwx+/+vd/zQWPryXl2u7Oq3q/EIq6V0jv7796tXMiq0kA+k8/6pMXQJOS7drOq/1ANBoMhnRdDwwsXQ8FgwC18OFVvt2WwuF/+qknXTKga7d3tjuhKEAbBDaINAT0BZjZthYO/+upCcQL13Y+9IOTgXPD1OuAMvxvFk0gQTu7XQfeexo6AWaw/2G39m+lpKapWSDeE2nnA1Kv7wBI+Z/G41lyWMru9McST3fWmKsAZFb9VxFSC8u7ndAweKgzwTwEQ6GZQIGsmRlULqBkh4LVg4UP/x5Cgm75EPCFp+toDfqd7evdfL6tulYtf3J9Xd+fAaj+nw2G9k/+FRIZDtfqPs+I4EKFzs5Jll+qoSXRyA98tfO7H/Zn4A6DMIFbd6R/GqMWPulEB+EFg4HOp3zNuUiF/yP/w5eq0j/ZK3td74dCAyjhNb1q/5MYw9pJ34sPpE7vHGTV8Z/2rtp1vTAozMHgdu2fwqiF8/sefAAvUL+uIXZVfgpIVZZBHQPLfurrXnsTCm23/wmdA/rl1IvPgQfiJsuoTSa/G14tk3fSzm/3vZQMFnbVvxujFm5/CIbc8PT96xoVL016KpvC9YjQBnlacGPUo6BX/1ZW1dSdghtfMLCdb0vSk4ENLryDWrvuuJlVD57+neIYzu673rEe6iN3fjmfWQYeyNfhtbnEcedvYlU5rJ668QX3r4F8oCu+2PeTe6nZUzfGYD//d0AEC+hiUD3ayQ9hTVnWCGjZBo/6B28g0yWRYFKD3w/7stp2KOh6l6fyV4+Tw/KBSEBQAfnhFyNE/B/+G8OqJDXn3wz8CIhSe9slj6FC/itDDNf6QfGdFoA/Qc/7X2wTTpKSG6t7rVK52IwosCxJyh2XNvdyeMloydXQ4mTrIdcrffU1FQ6oUNEEBgM2vmEIgWRVA/+LwMx0IhYrdkub8JsVxTSVPbyg0ixVh5NQtm1k3qVXo53a14Mo16OiAq3X/K7RZCZpAGUVKJncWMnlmrHIdMyyr1lNRaZT+BdpQzGVnOQwqqYNg3rdD4lfnP86ZJS17L7wPaG+vwCC7MGzJm11aES6kqNi12PT0+mcTa5qano6tYIIW+a0WbKvbe0Np6VU++Qi49fh1HBeUDG6vg0M6vdE8KyVzeKxIRFFWk6RxwdL2UhEYuaafc2mOT1t5lAKi4np2FYSAWqR4xHcqkl58fVG618eoaa9ElRMsA/Bg2j/CJvJzk97SsJct4iWWUUeJFceJ4BuG/bVJXM6lqjAH4we8K5J+LWiVAW945ZNGcXRpVVD+9kvbBo1+ZSLoB46aEsuvxqFD+hEDKAsWenIdHorh09mKZuSLV3d9DTKHlnl9HQsYgGIHPxyOnGMiDaUNftK204OiCS48nnBEOuB7Jc1G3KdUzAYyKua6n3J8P4tyQYpoVZJRDbQjWs2HXtYQs7csy9H3uwhwmpqa9oBW1KSNk8A2HJOGuBY5NT2KScj6JsviC8s6phgPUtMhOvrkc1KsVUCUUL9EQEyVuExW4plP+ymCfzYsi9voPQZcHE3UoVLTdQxjXXZYdLctGker3mfgRgl9VoXIH45fRPOBoT7fkLyYTQnIpSSZdNE2UJ2lVbMWGwaDAIAWlMczkT9me7aP2/FpmNNVETrRQNIG2toIJElops0ydpC2Sx6HwK4FMOrrOBxRD98IYhaVnhxM768AapwKwGc2TTIP5NmMxIDKqYAUaps03ADECbK9tW92HSiAT9YsRbIJOjYnJRTkOIAMNkwI5zag6stysvBF4GoZbmVAB3qHwHKKFvAmEWNSNDxViWSiEQiqaJUjpHSobSCCG3KGJEY/igDgTfAKQDalqSqgroVIB4rZXw3G0OeRpXUAy6MwdMvAFEEiF6Mb25CRk0CjBlBxkQNolSsJvDfdLqxp9gitZYGWOvkRysWixBy7qGTCtQGk9glL0LWSkpr1bGWQyCq6q4Asf6XIboAnqqCobLNnOz8B562i+yVqqKuQSNhFBFiogcMh+JVSaDwkQ/jjyCS4A+AsQe1hC5co4hVObjLMbyrSCydHAoQbpEPfDkqhkWAn9wq3HE+sRqK2kVZKSHExBo+6RaIGSgfYFyUOKJAgDVRgcJaQyIBsZPNMlxbUcBhXe+1wK8HB6FhAL9HYs0RARVwar7AIf5FdcOVDChRt5tmK1Mid6gWc0C2RjoSSTTRPLRM4D+thBBj4G/LxH0hRhDWimMaLfwP8eemYyB4IJepLUsymjGqkoYsUKl5rlKDH/4CPk0tcIDX6oCjUdk8LpYqtstmwVNZ4IRF0sUkxkf4xNJmCoTT9sq06VQqBeoEFgQUaVCd8L/E+0Y7Mo1vxIpFQPwqYGnM4V44ebdgNToMYnT3sx04TWa30UMnLDsvOW5oshUzEwkztmY/zVYTqQNsmSoBA6a6hMirZiytlImgbu5VN9aS9ouBeBj0z6ZCmNZITwNbJiVjK9XbM1DpRhC6C5L9OPzJwGpwiMHPTd9o4XqIAdyVPH6oVGlAWIu6pGHLQVFBJZqeJtqGKBG8amWru2rZ7ir5oPDUctKyP1kGXwEksqh0m0pvswReLXWE2LXGnuZO5YEn3uFP95mpjfAH9paAgi43Db5+L9Hbq2yioKVtzd6FxzI2IQqEB1wDe5Gz9SxSjQTFmkazT06EzFJQaw0ThLisdKXk6roCUjltevxSrayUk27QqkBFcMM/A58cPmHRhL7tzdEb5VQCZaoK0boT9e0p1VJaaTbB8sdihqW07EwUC/g1mcZb9j/Rv3NcbTm5ZlWVIjH5GyDL6PC4EGKg3DBcj4cZnD7TEvufkauFgJebCS+HrkXM6TRxxxqx6R5Guxq4ZabSWEFtMx2Dp81pT0yf5jC20MjnSdhPv444EOAfpWMVb1DFjUao/mQ+1drMcQgdYB2CIwTjtodfmdqDB9o006j3NFXOpRok6FlJmcUVEmQ8AaGdUCUvDzMcVQGhRn4F3sIW6GcXQlkw/dFXT4SoaR3+elTNLYTwpeAvT8dQAI8TkYYZw7jPSB3bSZpVlEsqdE8ASARV2gM4IMfCh61pTGLFKkaPeOfip6Q8o0M0/yQ+1cIHTIr3PZES+XIDQ4nYutFSTPTGUOik3pZki5vtAzyJSWU7ioYXtNE0E2BFmD8Bnk8C7eUKhieKyyFHu7jLAtfgk5KM4TzVMnrBT00hM4HWTGylS9Ui2MBIahNEUhnmTDqLKasRpUVQvquNnqNoULylYzRJxAVYSdlun4uOnBSdJ/CppnIt458rAAEknkiLuJ/ocW9K3aLhe+0TlkO5HMUADFECB8BRPeX0YFSlSixefIIoyhITwuCOb7iEkWoxDeI/DUbbwLRMJNW1RtUfJl8ie2tojsDXPUbexzwyzfSwBexQ4KI4KcTwDuXR4IEq+jJ2mcUuIxG1Dg4NOt1pMGHmnts8OB/T2MfbtazTQZuHH2pt8aaacKFMFSbebiWNWibVBJO7CgIfARqqdvsjQ8ijA70wvL7gWlqNsXbfrUOl6obGKkrgc9ohrwxBj7mekzyqBSvzNv1r2Z3t+n4B+w+DwWgwGAyBBux3Tq/zpCoukwsHHg79gQq8xUist7plFhtpfKFNg/ze/TKvqbaBYHESiJpKeVTXXVoGyxDmejVJU5oSCY4wOy9VS7bVFwHa7F3Lb3cCgMzb34XdbaFQoH+wW3OabbzCABbVWCcuHLgRRSWBxIQfMS9rJF1A1FNKkskc1PAOu37b/RcrgdzYa9kKBTxneAB4wwYJEv3sQ223HvDpAxKBAj3721kbo3thKUOBaEzZQ66pxhRTia2QX+ciJfelbeq+uZluyNLa1E8InrrdbamJySV4kUqXhHl2ZgLiQdtYS3a+U7MzDfDBE2zmm6AXUw8G+9s1bOCArxOYFROvqRjEYraCXamuJgn3VFMJmqKkF+YZn+6MJ2KYkhwtoVs4NhRMUKORUMAvw2hmzwTALRfPoEzJWJ8ODHaDjQLZOZGkgUwzSHjRdpRsKKjDu/AU06mKIPbwXj4xiGPtfjjLePRaUj0hU8nc2jLRNEwnFBRIrC31Vtwqxk4V1Yf2Yg4FGcV+Ds1tm8Anpe6N7bhKFqZTIxETTD/7Vvg149PQOGWjqfucRz0KDtyNZm9jEzBiDJhIbW1CQFg2PC62Cg5RfXij8Ij2WcTorvjIGm93sFX4BqZhp2OJrlLm9VR0kTifnozm0/CuwKOSSgtmmvOq1pSiZuytY/YFGNZMb2quJhNCc3cx01kzsAKFF7Bev8b/FvA3Pj2N+ycoii5ZpNkBjK02Uygl6a0VqQQxM/UwAKAmUz4FP3oUn8oqo/a1yAWODgFfDX3s5Goxhrwai3mMIAbe14Gg57kB24vXb95+98v75dnZ57Bmp37//sfffv3hdWEApR6q5/0bqzBddwwOznTELFqSlmxgrouTUarRJ4/ujiIi82b0/Tb7HrE7RCsqoGPAWWyk0zFz1WN6ZazU6h54L354++Pys+ezs7NTwpqdhV+9/+7X1/gC3Gy83ZZ8FhiJZhpVQLqcRCVnRXoVISCWmd3XC/JwImo16uOBw60KNHQYBW5ooXtfBSmodMGd0dwI2x4GBXhvAJ0bmwvns9nv3wJI16dC/i06VTRNkUQv0rSIX7OybgkIgVOpoxIc4YGHP9D3UHe9vZUVJouArruS2sI4yUoK95dtArrwBf6L8Iaho+vZ7PtfX7gIqYe2Vdvs8FecxLoIiGCzsgG6gEhg0qPjmLIJDbUYWo1d43LXko0ylTfwmcqpmEmqvUK/D5YvxYIJ4iv8+n48PAfk1I8/uDAGOzUxiJTR9Z1GI3EM/lRLKdnfTCJmYdUpA24PI2J420EYFEkI9z/GjDTNyhpbpElGFpQMBtuqqxtspvDt8rPJ4Dns+ssPIq8GC3mRQvBT14zEQH+i5B87CWOvl5hlFqPtT0StTYOmUNZt6TeUlkR1NtZg1jVPIgZUWUdQoTMzv049BR/B+Pz71wIZMcnOHgK/S2ukeytE8DVjlXLPWsX1nNQdG0ZE5nIHt8USGpAtue64EHbgVEI2EWRQdRefAzM//P78ifhsjG8LMwLEbVUS07QW8fGpXidar6s0BIsBng0jom/DnBamxn6GWwonZNjDQgq/cl1ZE2NQAMirXYGZF9+Nol88Pjf0b8/O/yuQMfRJBIixWyNpfy2Rv+Rm2oygCy5YjG1KI18HXCSh6OEbpLNnq9wttVqbe9XVjbXc6npSMLaqWLEMzPz3fJR+iS9d3C2OoONvLzjG4IHQFYi1HaXEftY2miSL2ksyWVFlrcYiWx/vVAtTOuiCc4ilFYzrS2YibeJKYY2spDnsQnqyRYAzhbcjBTB+cyFJl/PDL3j2+w8cYuiAEFG1nwT8fGQl8sW5IoaOGAG0JI5Q5UT08U5ZAhFcbr5kqZlOHeekCnqiGDhhybPHcmokEBRYdObF96M1TOYQP3aZGUHF5V8FiJ/IJgX6vo1mmuSKrZKZxggjYXbLiiWiyFIq7fsgZNbEZQv3UvCiEiWjnHDwkZw7ewGq4BAihy6PtoCZd5JxeSYlb4fL4tTU89/4Kwtto5wzma8oXRDAvV4ajWMshWUSxV0uZigGrD6z9npdtBSGHSqZW8exSAIbYYFHG9xVA4RCpXLmzUh4U1Nzt0npcuHBkIzl+IjLnv3CdWrwxNUckdOkjXWTMGhsq4q7OrbcbRvUsQl+8BKR6Rl3CliuxjDdFMEeJ8OwKmsrG1UhvAYu5Q08YATHrMyZdLY4lbmSpIuFUdfNvmcQsX1N9G0qx2aCtJSZwLCoAxMml0R8Isc71QueIEqWnMhX77s8e00yWgoGndjuY7GL+ce2OcBvx/loyKMfgXgLj5J0vzQaIlOpeqEmRjl7xHuLKeXKOnYnGcVErCE8kMpCjKCnd5ElL4LX7nI2VvSOFXR6IaovJb27KvICBcda+RtNukPaLd1LqnEz8lKBisG6aDGSjdh0DFMngLVYbcWwhUUSmarmKHbdU1FkFW295o4/icytNFNEHNOxquZKO9WYnZj5dayXnbmUrAcify+t0frUhsgqCyypSRoDUqSYB9YxnTAxaURayShHwsv4xJCIbKrRTA7oGU9fJbF88l4kHSPcUeROEjhVTAjHKhkkoUHFL3MH/HU+StkAxO8LTKHmHQNNAppylySnViBcJBLpyiwKGZugO9anTBraGfDY7WWU0okI6Y0RXtcuA/h6eSzApXcgfbaViB/Bo44h4tSzt0wU99u8/CGTpKlRSsVi3W4K3BB3FyMo974fm1Im1QNDWvM0dCNSsURRsBScR/UXv4+PBF8+Skz4FgxZehzhvJH1nJn+EA8F7B7djZ4ZiaS70kqp5W4nRpGlMaDIpjLDfepTvSQVaPR1N5q0F5v8mpcLAj+OBxh/UKUzaiMWziQ5fDuaTWFRB07XmQkjgVSJqD6sykqSu7RPEos0myGyKTX3wKTSYDJOplk9Y4O+MCyknNBYZQI1ajPpHWXMzP/Bfe7GsCnaDMqndZa7xUK4gr5Vqkj6NUmDeSnnxMvoA1ByhYSGN22HM+nwxbPr8N7gG2nmZ+b1eHxANnC5/6TO2tw9FiDHsSlEGoxPT9j2KnBxsNcv1eUV5wr635yUjjYF086JVafCOWqrlcwhIjNcMx79fpJ0zAJYiCPKl/H/oS/x01g2fUbjRZLdZDHGWipm7nH5k5PrjaSAMD9o9Gv0TV2PIKG9CcapHQoON/DoeEU6NXUOz8cMRPwc7/PnKP/bXr9Tk4GeCKUhdsKJuWhNatk91M7rbzumlCczwlmaB+Zhheb08PgbD/glJaH+YqKEWvwI6M/9mGWsao+zF1OCyQCWE7S4tSLZPcpOSWOPFBnZn0+99oLm2OAuQtLA5kt5oKnU/jMn4QR6FNbcn6ADOMIlzBwcjoiE6Xr+mibrxTKDJuBLbnRjaTBjQr6Gpb+pjy07Yhg84MZQM8rVylChBGPvkH3mh8mSTqhKBYQZRPg4AcLZ7xkRmY4Q+hqtalFJYX+qyQNhlZmGKBXENjUgeYEn10xFSR/vrSV9YbIKzsxEaoY4pTKXw6kbLGuNtfm4nlOjGD1h3267HcnKZkPBWIpEsDwsB3ml9uKV/fDhmkOPUI2rUk1K5qrlZkpRGq0Na6DZKf9EEtoIj9ya5nF0fGEvTsQO4yDMma60mggP8w5YUEwLob5KBZFaRO0VFUNXjo0Y0MpGqRFRzPVSteJqeKo/kYRTS4jwigaFYC3g9tYkCKee0URxsMafTd5S0iSkw3xb2twqNxL8+WTJaY3VC44gOlEslmOEcJqZv1wpBjdRxP4HlvJ4PSHAqbmf4d7Mi0GLr03GpVOzP1KE2/zZyGY/RBczU83SBpbDNvijS9Q4RAlCLemE98FdTDlKoh4FZl8rNdOkLskYXRX0zG+TIowfgdCfvXT+hV7bpAinpl4wXSNxzy0FsVw6ZTZaOUI8yyxxhJpKZdduyaS58GieXSLbhUGt0lo3TTuRqFQEhNRhe3E+IUCw+GFZiC3O8EYXE+hSWLM0xohmefuLkUqnEsd7FaYh1nuiVdunqobQkCkaZj1sjWrtNRIoy3YPTZEpIZkx6cybyesvC1iRc+LDqQXyYGNdb2e9DzA25SjK5VWDthcQWXLlTR3XNEQybtztljgGyagWY2aCdJYAvOamJdQKWeQ788ukTEo8b5nG+CCGuK5GZqP4mnV0jb7PAzvZCSyo0yVLQk1fomKk98mrpKpU0MaSpaQSdo47rfRaOQc2xU+9oiGRfXwuM7+wMD+fmRNc66UroGH4o52nOSO9K3/wPy/jZ+YX5hcyc1MDN2Wum2DOyOZnGyKx/mKpT+XWLKQKCENCwof0cpKmmUR3jXOCQ0Pa0enLpPHM/Pn9/13gurw/X8gwE/iArighYvwoiclybg75Zw7/7/Z8PuONOb532NSzr4XAUsnGU1mM7WC1HS6LEtfAcQCiuwINuwo2dkbKK2T4mMc1pbXWQZc0nsnc3okC8Xj4U8bhxZePOAUC86TAsKqmSYdOxL8En3l0feYo4wH5mrmV/BkrFm+GlFVvgOAUlKMnWIcLeFQpvg5rtbseMdON1uqgPyOdOC/oxe9efB8vLecGZLc3fm348T4zR9lUlayPc5krUvd3shhLS1ePEjVOsmo7ZI+XDyJGmrHR94UEf1kxm8XS5uqKlfTxLKkF3MFOQpoL5i6D49WutIo9Rdnq7uUMVxTlNI/PeMz93E93SWcym4ErSdpjQZkBRnzcmyQ+/uPH2zCylm0N45l7h3zOZyTJnlVk3H3kEGe/o56bkIPYKBeboASxltIsdlvVlYqYk6oL5oJW70OeLm3yLyO3V24qSqRYEaJ/5/140jNz90kkUvLx8N3PDzc3N+cff748M+xE9eEDKJDMHWlpsAyJbMt+t7Q8lXm4IOjgM7fn+JmjPy/PLJl4j4aQqXrvBMK8qGJzaEnZWNlrlYvrWyZgNQR14xiI0KuwpFEfjhsLCtERXqNSLa0Lm8loEtHr0NzANzxe/rS4sBQnzwbqceHh8pGIsXWfAV2DjxAm3cBhyQKVOX9FCswXP+Nnpuhnzu8P8VU9ijrVEUSehLD7WaukQ0uSVorgpCo5gQrUBO4bkrZLf/YitNstbC2jCa0rtAoZcFvD5aUreKwHt42LZ27eWfgsxuUixhe4S1MlKbF3mXjmEhs4L44WPdmMb+A6NXk/xyHSEIpXb+2WxTUsChurRZKQt+fBOIvSrW+wshqYQw+XsmFOydxeKckR0kSPV9FMLYKZexxI1mc+XhBVfrgYX35kyv5sMT53AdxqXC16P7DwDisLh4sCDZ9RVcNttt2Dlm4Zm03T7l1WWgINqUHUNUZPDPC9+JB4GCUmlKZQkHFyBINxRfzBGqQi/HrxkojNxfzSLb2H+tPSzRkmXH4a8NwQIMaOInCaVhRqf+T5tK1eD+ulEGSktjYNITvMXFGJGfygmGfj6LbANY3FYrTPA5cTbPkEv0u3oLet24Hq5/w7A9/4xeI9fYnJPwAgypo33TZ3c4dZXdWdaZz90aEIT+iiJ7NRhPAJY+CEso5N4ILdVmk4wePfoCeTmNs7jpiIzt5xLnDpqa8qJStzBYynHt54vRKgC9p4vhPE/nmApede3qJmktRbDyNQZcqygSiEWySFEQHHEgeFaLImlt85QoOmoa6Fr68U04qZjjkNGGB1GoJRdT4w862Pz5a5R5OoXj4sCCDBKbs12Jt/PHS6gGXp8Hx+iV0GanTx/gzHZgJAL+/+7sSIvI0C1QwpB5tmyRVWODSkEVdNMjos/uX+wiqWPgh7Y4DRaK0YgtvX8TcWDsRbixDh7PIonlmcn59fzCwfCU5Z+CK+cGfXRrAQcnH1MDcPly0uLi3fH1qkXiA9Hg0GHT4ILfJ4vU3vdjb7z46+h5jS2GduqYAwhZ9OmOlecbMcsSRX0WIUwuWpueVD1Z5vaDyenV2cnT0mJaF1++5lfOrlodMERDrVrTOyHu0NQjIy+WAufJYi5FE6dteYjWqSJ4aFpUlOdOBGyCITMgQgsl7ewwxByZ6JwG9CXZrvfIPD5fii7YgJUm8/AQlY0d3GEjC6aZKrK8BODKln936R/3MHYVB0no+PVxxeoDGiwKUUYV5EyF/ARi9lTndzxEvsRtyb48cghDW3eHVGNqmjy6Da5Vvj7N2N5YRMGAyDPJ6/OzOIyuZ5dePi3mv+HYSv2QOz9yEZ/Ee7BiG+1ZEI0QVZaTXA6S6vWoDQeCJCMBuLP707s5wnMKzHuz8/zi+B/Mlq+H4pfm6h0rvMLC1+BNmjwYvxeHH50/yQYo0PQs1Yq1Qsx1lnD06JRFPWwxCS7sbKZjGlmMX1nkdVTYAQexDnb/74+f7q6v7nP5YXSbQfP0KX++z85SW+ctJZg/rzHC+7h8tuBMU6DGFQKAZXIKxI97bWi8fd0ube6kquIlqL0TSk+1Q0q1pOQBhWWhHJOBFCgjI+h4s9NgkupLNLjJ2kOyZu9lVzI4uJsz5ymFxZreKEjeJ6s0eaJhUu1aqIkFsL32WslLYUpSs4RCOtxUjED5a90ceVwphozQ5YC2GFV7dI/jstymGA69IOs/gDyxZf8N5aLUFTUYRvn4oQO/cwiIcIKjm+/utay74IbVW81iAZl2mzJ+5n4zlWY4jX5gXLkyLUp/nV69MQrozjGvagmT/tgZ1Jr1cm3iTu3Ef87YDXZgPELoVj7LuLgGvaNYTYgnltqr/n7XzagAC61KpW3IaLJjH+6/FL47f3qDKOjv73sJSZz/iqjcwtuPBy2MdpsZOQmbmH/x3d4m3uxWaU2V8cFyUgVmfgv1ZXwXkxkUSqbLlSgoJfypKJr1wINdz5r6RI47NStARFTOvbM689CJcu2SXJx7O7q49zmQHdD3E+RvUD0Ud8KRP/6eriTMh7vRPeAk3UsGKSRAajGC0zjd5lwix6Z/SxdKLE4/2O+xKrocTsnPB0JN0TIdJ+xBfex7yBpzfACXt0jJR1eL/sAYnKBgIsj2MdzyxfXaBNShrg6j1ahuopn86+9UbAIM7JvQiOcwDfe31Dcud0hZSwJGYxxJwcOH22701WoqhJAzF+4b0HIelc+88CLDD4d8TRNA5v3U7KA7oBboRLS7eH8Nvk2eWfD4v4aQW8OtWV8n/+xkHINvPg9BGFPKG5VU0ObBCiCPUCSMUJ7a+RxDaFEk58At/bxMbnVFpZ4Qhpb8pgQvjmUTqzoybgusXbO+LUnN2LeYplJNXjPM9QzC1d4buwLo8WnSpA/KOBWQ7xxrRKKubltSJWgGNbJLYQci722uV5Gjk9o0AAABWvSURBVI1WE2f4C5ClJIS+prl13NpbqVQqG8dKSbA1/WHmAvu4Dxme+MLDpSGFwZk+4s70uQfh4u0Z4AOnlaf/zx8lOfng0lPMWJwIj7gOAWxsq2ox103cK3hNq744PsBbXEMsFSXR3Kw45SvcWNkQ3D9qLrzK1I4aDnmGJZ55uEMDb9yx352jHFKEy3PxuzCw8mWcs+3SA+Zv3rn4mKlSMTw0jps90lyvmJGt9cZxtyt0DdEGRaI/mV7lpgbjZzKWyS7rgCmsimP+aPuNTz8bbhg5+8gfLz6PaQlw1T46YnVjCW0mmSP4o3QmZqPm7/EVHC64ClBM0Qh9d6BpDNJbv1olw8IbW658KfVjcHtQknpwnAM0KYe7bPkbSa4qBi/PUVXjUz6Mf4TY0Lh/yXlsafmQhKtOYgJElSGcv0IbdimI6dziJWZw3Ik2EMMfmCrlUbp7aVoyKY6t6FNfFLfZnQ44pvBAzsTKpLVSbR03p2NOcpkgpLuLZnx2AM19RBpc/G9BYNVLLE4n7zMOQslBuPAOJ70KAW/8JcTO6LN6E1RMDIUxFsmNnLPLy7c1jTIm6aKlFVK+GwgcmnRrpVoqbpkp+L9ELOJuVKDRxQ8+uag5dK+l5N05x7j4joxrIxAJl54hqvl32OLIc05zL4/OiKdy5gXIujHEvReGYprY6mNTxIuQNWOQEGmHmQtGQllrQGiII6Ai9k6gCG+nhpe8PcwiEkrcHGKmKXx4xOK9+UtM1JAU4WLFQZi5AtTh+wwl9OL9I9bjpPDdQIH0GbWGAWEEAg4AS4C/lTjeWzEGkhhs1hzJNZwI6WG2umnHnyFNK4l0ivccaewN+YcX8YVL0k2fPHv3MWPbuEWSmcG9CDbCxam5oyRwwxUCBH90yU7H4RDQd4MtKJRJwd5zdiTj/rDLAGE2u9Wcq87JCjN2twmlqOi3bxKLj61CKTPSbHRbfEAThHe0+jSkYSjz05ndOWCcXd5/nFuERULos8zU4iNBGF9+JCpzcTGz/NPVHebjSJ7t4uNgfwZvGdoVEJaVRMKhQIR0NDVFp6YjdptIbUGZMjavKgRaEaDl7IQL35Kn0vAiMOPHpkiW+fszOgnIeMQVJgO57775DyK8+M83dyTTgn9BZ5vU4oHot/M+AQlrFA6JGwlye91GBHWEzWoROmdaIiCoKt0hsMMfnH9uCwhz5U0KjSyjW3JYXRW6qgZjRIevpuYy95hvY1k0lYx3Sh5eoFdtXVyQ0rvzNycvdHELdsOnu4O204CtoMlycEkwe2ytbJabaQIzwvcMqkL7pbMhYZu1m/g3BONenKaZSAp+H22+LAxvgJ5bPLq007waQTOYtbWH1JN3oGJp1T9wfvart/0S30e555gvw1ptFXspU2HxE7zCvNtPY6pGr/EdQWxMJXn1rXQCR6UJbh8lol/xgvFq5ub28tF2jDVtYNSVTClsPF7+sTSgQRk/0PA+ID5b1Uy1NKdXW9KMXLUr9k7SXsSOo35otAheH3sKOhQG/7/SwKleOIGbl+foXovC6L4vsAIf7+/OiNXynVjyiLpocSg8IOG33tZEO6WSW1caFTGkELLnTNE4H9GoqoF7eGZLEgWwl0iQTV3CJnyZ65pRRLRBzmUW4x9v3x3S8pPNlmA87t7dfowvZkbnEadot35ITGCgH7ieilUdUjgpM3upco2+lB2qX52BH2hvxAk/9o2Kqdh0LxLrrYljblU2ZqMwBqADM770H2xsM96dgSY4fIdo775ZGshZDYg12/yED+d6+1a60VPsSS6ekgVraQrScEmjwVTAvT0YX/aGSUx/ggxV4DtK+FC3mTc+fdB+VJnHxhJL+RPu80BGJA+2JsYH9dY52zWT9bhme8pKsqj0cgMem+yzaabGBdG9gdTo4rZ3wFdUKq4AUxjM5NMIHb/34bwF3KhuffMzaJyP3yBCYbsFIgNuvr8fcNj+K5DQBUVr4DEFeziB2LPYpBo+6ZttXQseuHcFrW2Z6DGYZSOntJwJqvYrg8vo7kofxyZ+dPHTvJcDM3fhZNh6eQsB28eXVjKpXvJMzBKE+B+vzg69VBU2PmUliSkUiAyTOTIzFSdS4/5kETybrEBCJ3vRyTvubc7JFmkPTvdAnpPrW0nP8WH0PqBsfGL98OHtxxt3mLd8fv7wEP/j7vBuOf5wfn6+LFxOXJvBcRLndPMa24dG7GdLiTWbifJmdXXNsrpmb8Otp+mGEq6bJC0/uC3IPsIAwqYyUfXI9Qb6OAOJAlA2g3y6eKdiVe3CmzYk7YveX4Jf/niGpTXvXWYZj4qZYFVrgsOMAw7B51Yi65EYbsEWFtunxodjaGxrl2BzSHwRiZUquY3qZuvYbK5vmV0BIR8qNbBHFv6Z+ePu0bLkd+Mbnedu7qTw7Tc+pTW+T1bYcoZbgEma2xligX5pLCIWAGlXmmtKDR0ZgZvguMFYAffdJGelKYrZazaK5VJSzEuyGb4zb9xEJIojs3gzf5G8dwLh+NK82ytbWl7MZJYymcVbiJssP+eP73XWO1x6NNJ3aaYTCbrfYlrwutFz4jvyBdhsooKeFahkFIvlbosUHy2asROmtsjCVu63vltn4n+o6sXtzcLLhZs/3l08HvGwf27xyrDuLi8v7yzcH+S7i22ZzRzS8y5B29jbLHWL61tp7LxEsCmeYlE5k/bbgtoIU7UREmbTyLKnM9Xa2DC4zoYfany004++rs38HW0cJQnwu4eXS1hZml/A4Mr5auCZM79i4jIb4+I+d6JqD9rVkqAXQID2Wt3joiE+VIDaCtdu9XCHARf2Pjmb4Ih3oyZLiVQqssqzXeJ2db3w3jcYXjyU2NPhBv6Ld7cPR1eHj5IzExHxSWcPPh7C7Bths7ogOlpRaeQ8mRlhs6U8bGyEOPjDJ4LCjqoiDmWO4dlh3PILfDpkw/rCla0ErLOka0gtRvwXdv3m8sYHIN+q7h1HLVdTSikptiW4sLLRH333lm02l9U9vIV9DtukInZWhG6bJotN1QSI/rNplhb+d/Xu9vzlf66SZEIu3i6MjeCX3ywsnB8dnb/0k8Hn3zKAQXeDPg7Z7SqpquzytukSRirseN4AG8ATGDKwrotD2BPNdVMYTyOJY9+HURHUKPGwM6g0CbeR0uY9qSEOqRc/4xTEYVEi7Ql/2qGTZy++/UDUSoeyXoS0Kuhbzwc92k1PJ9Zx9LuyJ87a4/4pQPSXRbrmFi8tWzTCxuX5qP0yswLAumeGsmY3Z1cjSslvQDobbdLx/kWTC3R0jevgYmSG3HGvuQdRYpGMpNhULJcPvC1A/HH0fkswfpfgtF3e3oxyBGaXmZIBaRInBIhfC94aDhkShJs8M92AHRyc8cmHmbmIiDP2zMR0zGxGFAu5Qts0iy76qwcMoh4Y158RX8oseLeLeAG+57P33FP9ZanaapVK3W63XD4+Pu7FUsWc0LOKi42/CAymnMI0hBJHl5KEAZ46AgFGLEUkoGhOu8bTQWTCIYJ3M2YW1tj1/Ec+sU0PiJod60XYV5CGlYglsHs2kS4ZYkjHSTgwJgohntKg40RIS2qypeBYrfXuupKDcIOkYU1LzIqo6qkA8fX3nzNRkBFw6lfhnL6CsPUaq5gNZ7eZU38n7es5/gpkiU1BjvrpS7YPEYSUj4MB3axMx2LVpGSsN9YaJml9EJUN4Q2RioFvcSLrJGMWPAs+4poOiQAFVtGkNSVNmvLJSiSAlCZON2OtzSprotBPfUdDMoMRzAvzZ/HNxcg0zTUFU1LTEbO55uF+HD4b4Bg/l4yzz34NCDMF+y5vFP2MCk7a6/V6W831RrF4XO52SwbPHsmsKOZPQjFK5BuoJGLrySmvK82I3ZvTSpLjjcSPyuq2ML10ZubNk4d74uhLQQIB4H7W45lhBL4aw5kmmsYPkBIcLL7Joj9kRCubnIh9itwMaY11zc7Y4EEB63QDlSu9pQmmP0AGtD4R4+yz790jWuuq5zBX274bJSVddV69JPZqwcVtRsKTIdMg2AlPJJvB719R9lbIgY2RdHrTL+9PVl48d9keQjuxWp2d/cU1ZlcPfvLLH5OVayjNnHdTJHnY63EkBIhsJva1JMzVlFqKPc3MLFakQTtjLw3dcN2F8c33w6dAu8j3+2+v3WOEAydDB+XA11d7xJ9xZ69VVkMDEg5HyIhYaKtinNhAFZOI7Hl7q8S3CFZj1z1Sfmbm9dv3s6MpOfts+Zc3L1zjrvXgsKMy7afBSV9KrOqOHISRQH5zLzlEPk6Zh2QyOWIzZh5bkp87zyGCV1j3DvQu/PD2lyn/id6zAP79j29eeEaWBwO7qnCCAM7RVl3hoEwcD6XhatYTJo8NUaQOQloYxHSGEDcDn/aqZEPxyIVnhBZCrufFkeuvf3j74/up588BqLOePX8++/sv3/362gvPPrFddd1zsNkC93RVew1NvIrlb0P+tpBBpO6JUCZAX97AnTeDJUDPwubY2nbIO1hfnwFavnj95te3v/32Hazffvv2zQ+vX+DhAd4rydEBrq8hOt2zkdk+N7jiuoofjjD6hAthaDlzwB3b41fkHECIX531P/xhxr18LtGD/R11cF92e/vUTVanoub2OdiRB34eqbjC9Ah1jFuE8zTGYLMXPUQl3xmg4/ilRwvXnjMDyCxouFlovyb51x/ty8AhZYP2CkOmlbPFZkSSY2bGEW3od9Y+hJ5wCAt+W3R/dxCCio+u43OfjEAoq8I49p2xD8fO8CATDD4PIZK+ttOPTnoSix4NHeRVacBEAMfvO4UyrEEMNSDCYUGjz+9wLqcWA8++/EyE9vjm7KdCdPh5LBRdMBjq7NYk75kvZG07H9dRKww1kSqbWQpqZoIDn7iy0TvkSJQJjlAaCjW7va8PPfFJ14OhYOF0d3CUIc5cQAIyB8T/fDuJRKfCEYFjLAVd/EgrMhDmrwAk7JrfrvcDoWAQz+1iCyinF/YPrrOq5DNuE8nZpgQkZ0EMdaXgL2yg+MB45CFLk6mPTvLDn09DlWwfIc9Wy+ZfHdQ7nX2yOvXTT7v5bNt5C/JgI4rMJBCPEGhLQx8C9ShLS487J4hDZMdAEFF8OkLucdHlfx396+A3tLfZgXiBXWnEa4bXw4Xw1cQnH4d3GcT9z9GnNDolj2ZPylEHj44b/mGVERAi/exIYywIoTePP2ppEjvNOXjwGeoU7NP1bjbbFmg5/FzOwQ+3r5lqCh7USMvf8JVl3lF0Ej1Kl6bys3K3x1/ufUTpOhAlmqR+cH0CSH2PNxr68WyHfjme4uE959Wz+FT/6ASHyomLH7XqKU+OWppKtCB9RKIyg/Zpjts7+WyN0VR0rlmaRZXJDTgBiScjjz77k2mZUH3EVb4Py0UxkJ9UFoml50qC2z08zRGQAlG3d0+yfPKDRuRUReNHOJmcCs84dLQ3Snw6lqmdxJnxLn6wen/Sc71RqeT7w51uRIpndAZspIx5bYOINpATMBA9GMs6/FBAd9F+sqWFmVWcGKImtT9N4osS9o1Go6F+fXtnlyKVuRMTIOfVj9NPIsDPOT9ea3ON1lGHJ2jIw6n2BSeFp0VNSFMb6QdQvtfciSVGYhQ+lBt+nnN0ckvoWjwFGqy3RyFUiWMi1epPPdaRI0Wa8reDuajRS8Z54uzxTp8sg/ZNwiecC/yK3y6IoAQHzgX8zKWHPk0QcgsA6yNOyxsDkZ/PAVQchVASleBfXMHAycB5pIPfyAGOD+tHrQ8c4n7WXzBkOxBgRbFJjo8dCbAzTq/JNPS3vy/wdDXKl3CKPBF+P4Qo8ycdzjKF/RkSKX0ePj100J4gacm1qK5nP0ON8iWH+Uk5Q4wG2PhPHE+wnlXb+Ws8yDn6GTB1fYccCzzmqYTCuvc8mScvTYQYyPt99wkvydixHMHdru1u1wsA8yniiYcCamNlsH0qAvwLMuhA1ASI+jY5y5En/GWpdipYsYAn26DW8ten/VB0wpxUsNMeYwSJ27v/RQF6qBg6cCUdwu3dGW4iovW2W1Kdf6jZ3e3OTHQc1+rRT/Yw0lEIZSnPT/T6MgAR4qlgi7E0yxxxNcuJA36Wqg10Kcm00KnWTpCcoaFKSLfPsBjFoRgcC2eBgpL5IgAR4ocof5BAnnOS0PWFJ8DKnsycSqIpYC2MIcjD1LK7B52AX/qNfX6kELaFlx0K/FUlI0CUdkVabav0wBCVuhZEyU8ax7ezNP3GQ8Hg6ZgwmQRX4lGZoc44z+5JK3wipHZDnawDEQsb+JdgYdc+KXCC5SRsUAkddAqhIJJT16/HWgi4QIw8wVX7YhQk99fywt31grPvm5ROTkKkaCsPpj2H3EsmeVx7/yoooXpf75+MZQAIjgWtHYh+CH8hGWSPJbWF84z10GmN9CCR3PQuHok+TksIiyQ7NJ5FbNdqI4pAqmTPpL0WIjM9OrzQ//kLDCPXN+DDXauSf67zyy7V3mzqKkrqoc8JeMcvTTqJit9Sz0o+6eovvUiFuy0SEB2Dzwt4xy8tHxKq9OQU9M+tME7+nZj7cZ3YHj3VvjyH0hVWRU4NhLBq6zRLfHFuVWVHebmr5now/6V1jGuBWhFru3q0n7ezNF+eW1W7oshLUDYBO+pXBYjhVG1fTFboUXKa/ddQOPjS2u7ODj208xV0qHdp8o4rUtCjHVKh/tLfAzSsbc+48AU7ta+lYlxLC3uSatglQnwueWKTOGI55gG8+lPdldoKBnY+N+P05AXS6E6MAsbr2l8tiTvL7qdp5+shz1ectr+yBLqeItx+FQq5HyBwutv+IsyK9cPrvrvFQYeo7W/EhwtY9dQduOt6qL+df1IhzX/VduoBz62xWeqreDEjVzicrXu6gvSQvr+dbduanjWdjF1kPI9kX1zbPQ14O1RCgZ2vbSKGrHD4pO/tfEKQB3b9jER0E6g+WXXGnLRr1/XAQGwcCn34ak7a+KVpJ4WB7i49GArUd7JPlMha/qDvE/oHox/aX9FJm2CFw3kvr9qkDAU62/nJstHt/E69H/JJO+rB4M7fqUCHLKJzfLKFuh6MRkP7dbEU6l3Z/O7w3LEeLexI/zw+XIBxpzAkI2rjnOl3Oq+ur3d2nXV9fX3Q6QM0+Jt/6g1Y/TQf/ufkz7u0sJqv6yPSvnZ9mxR+YeFP2AM29OoQmIda+N9BP7rkMBCyMwrkpAuEr3+Q/YfMw+ilIci6Pr7hciS8UP9Dtv0vI5+wwgAy/6GPKcLPQBeK6vWd2r8Ynr2AkmC5PxSCw3TIENJFdbAueHLcvxuevfAp2+389odANBocgxMMJ7yL/e3rWlv+txPPvRBluN0+2Xl1WggR7YldUXSFsEKDZiTQf/UKGDMp/bN+y19Y8OBaUpWzJ7s7r169chpo9zsfANfO7klbTSbta/7p5/zLyx6mYPClkd/9LcD+H/NyQssKOs0mAAAAAElFTkSuQmCC'
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
          <Text style={styles.headerTitle11}>Tanggal Penerimaan Sampel : {dateFnsFormat(new Date(p.q.tanggalTerimaSampelAdminLab), "MM/dd/yyyy")}</Text>
          <Text style={styles.headerTitle11}>Jenis Pengujian : {p.q.unitPengujianSampel}</Text>
          <Text style={styles.headerTitle11}>Tanggal Pengujian : {dateFnsFormat(new Date(p.q.tanggalUjiSampelAnalis), "MM/dd/yyyy")}</Text>
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
      <View><Text>{p.q.formLaporanKeterangan}</Text></View>
      <View><Text>{p.q.formLaporanKesimpulan}</Text></View>
      <View style={styles.footerRow200}>
        <View style={styles.footerRow2}>
          <View style={styles.footerCol}>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>Pelaksana Fungsi</Text>
            <Text>Manajer Administrasi</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>( {p.q.manajerAdministrasiAdminLab} )</Text>
          </View>
          <View style={styles.spaceV150}></View>
          <View style={styles.footerCol}>
            <Text style={[styles.headerTitle11]}>Makassar, {dateFnsFormat(new Date(p.q.tanggalUjiSampelAnalis), "MM/dd/yyyy")}</Text>
            <Text>{' '}</Text>
            <Text style={[styles.headerTitle11, styles.headerRowLeft]}>Mengetahui,</Text>
            <Text>Pelaksana Fungsi</Text>
            <Text>Manajer Teknis</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>( {p.q.manajerTeknisAdminLab} )</Text>
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

const PdfLHP = (p) => {
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
        <Text>Form No : 5.4.4.1</Text>
      </View>
      <View style={styles.headerRowCenter}>
        <Text style={styles.headerTitle16}>LAPORAN HASIL PENGUJIAN</Text>
      </View>
      <View style={styles.marginV10}>
        <Text style={styles.headerTitle11}>Tanggal Penerimaan Sampel : {dateFnsFormat(p.q.tanggalUjiSampelAnalis === undefined ? new Date() : new Date(p.q.tanggalUjiSampelAnalis), "MM/dd/yyyy")}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableHeaderCol5}>
            <Text style={styles.tableCellHeader}>No</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Kode Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Jenis Sampel</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Target Pest / Parameter Uji</Text>
          </View>
          <View style={styles.tableHeaderCol20}>
            <Text style={styles.tableCellHeader}>Hasil Pengujian</Text>
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
              <Text style={styles.tableCell}>{p.q.kodeUnikSampelAdminLab}</Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].jenisSampel}</Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].metodePengujianSampel}</Text>
            </View>
            <View style={styles.tableCol20}>
              <Text style={styles.tableCell}>{p.q.zItems[el1].hasilUjiSampel}</Text>
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
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>Penyelia</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text style={styles.textUnderline}>( {p.q.penyeliaAnalis} )</Text>
            <Text>NIP. {p.q.nipPenyeliaAnalis}</Text>
          </View>
          <View style={styles.spaceV400}></View>
          <View style={styles.footerCol}>
            <Text style={[styles.headerTitle11, styles.headerRowRight]}>Makassar, {dateFnsFormat(p.q.tanggalUjiSampelAnalis === undefined ? new Date() : new Date(p.q.tanggalUjiSampelAnalis), "MM/dd/yyyy")}</Text>
            <Text>{' '}</Text>
            <Text>Analis</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text>{' '}</Text>
            <Text style={styles.textUnderline}>( {p.q.penerimaSampelAnalisLab} )</Text>
            <Text>NIP. {p.q.nipPenerimaSampelAnalisLab}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
}


// *********************************************** end PDF part

const condition = authUser => !!authUser;

const PageAll = withFirebase(PageAllBase);
const PageDetail = withFirebase(PageDetailBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);