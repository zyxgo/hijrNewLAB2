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
            Analis Page
          </Typography>
          <Switch>
            <Route exact path={ROUTES.ANALIS_DETAIL} component={SampelDetail} />
            <Route exact path={ROUTES.ANALIS} component={SampelAll} />
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
      .orderByChild('flagStatusProses')
      .equalTo('Sampel di Analis')
      .on('value', snap => {
        if (snap.val()) {
          const a = [];
          snap.forEach(el => {
            a.push({
              idPermohonanUji: el.val().idPermohonanUji,
              kodeUnikSampelAdminLab: el.val().kodeUnikSampelAdminLab,
              tanggalMasukSampel: el.val().tanggalMasukSampel,
              nomorAgendaSurat: el.val().nomorAgendaSurat,
              namaPemilikSampel: el.val().namaPemilikSampel,
              alamatPemilikSampel: el.val().alamatPemilikSampel,
              asalTujuanSampel: el.val().asalTujuanSampel,
              petugasPengambilSampel: el.val().petugasPengambilSampel,
              flagActivity: el.val().flagActivity,
              flagStatusProses: el.val().flagStatusProses,
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

  handleSubmitKeAnalysis = propSample => {
    this.props.firebase.db.ref('samples/' + propSample).update({
      flagActivity: 'Submit sampel ke admin lab'
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
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && !!items && items.map((el, key) =>
                    <TableBody key={key}>
                      <TableRow>
                        <TableCell>{el.nomorAgendaSurat}</TableCell>
                        <TableCell>{dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</TableCell>
                        <TableCell>{el.namaPemilikSampel}</TableCell>
                        <TableCell>{el.asalTujuanSampel}</TableCell>
                        <TableCell>{el.flagActivity}</TableCell>
                        <TableCell>
                          <Button component={Link}
                            to={{
                              pathname: `${ROUTES.ANALIS}/${el.idPermohonanUji}`,
                              data: { el },
                            }}
                          >
                            Detail
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
      kodeUnikSampelAdminLab: '',
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
      tanggalUjiSampelAnalis: new Date(),
      managerTeknisAnalis: '',
      managerAdministrasiAnalis: '',
      penyeliaAnalis: '',
      namaAnalis: '',
      metodePengujianSampel: '',
      metodePemeriksaanSampel: '',
      targetPengujianSampel: '',
      hasilUjiSampel: '',
      keteranganSampel: '',
      selectMetodePemeriksaanSampel: '',
      selectTargetPengujianSampel: '',
      thisP: '',
      thisQ: '',
      thisR: '',
      thisS: '',
      //tanggalBahanTerpakai: '',
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
            kodeUnikSampelAdminLab: snap.val().kodeUnikSampelAdminLab,
            tanggalMasukSampel: snap.val().tanggalMasukSampel,
            nomorAgendaSurat: snap.val().nomorAgendaSurat,
            namaPemilikSampel: snap.val().namaPemilikSampel,
            alamatPemilikSampel: snap.val().alamatPemilikSampel,
            asalTujuanSampel: snap.val().asalTujuanSampel,
            petugasPengambilSampel: snap.val().petugasPengambilSampel,
            penerimaSampelAnalisLab: snap.val().penerimaSampelAnalisLab,            
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

  handleClickOpen2 = () => {
    this.setState({ open2: true });
  };

  handleClose2 = () => {
    this.setState({ open2: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      tanggalUjiSampelAnalis: this.state.tanggalUjiSampelAnalis,
      managerTeknisAnalis: this.state.managerTeknisAnalis,
      managerAdministrasiAnalis: this.state.managerAdministrasiAnalis,
      penyeliaAnalis: this.state.penyeliaAnalis,
      namaAnalis: this.state.namaAnalis,
      flagActivity: 'Permohonan pengujian selesai di analisa',
      // flagStatusProses: 'Sampel selesai di proses',
    })
  }

  handleSubmit2 = () => {
    this.setState({ open2: false });
    this.props.firebase.db.ref('samples/' + this.state.thisP).update({
      flagActivityDetail: 'Permohonan pengujian selesai di analisa'
    })
    this.props.firebase.db.ref('samples/' + this.state.thisP + '/zItems/' + this.state.thisQ).update({
      hasilUjiSampel: this.state.hasilUjiSampel,
      keteranganSampel: this.state.keteranganSampel,
    })

    this.setState({
      hasilUjiSampel: '',
      keteranganSampel: '',
    })
    this.props.firebase.db.ref('samples/' + this.state.thisP + '/zItems/' + this.state.thisQ + '/bahan')
      .once('value', snap => {
        const a = [];
        snap.forEach(el => {
          a.push(el.val())
        })
        console.log(this.state.thisP, this.state.thisQ)
        // TPC
        if (this.state.thisR === 'TPC') {
          this.props.firebase.db.ref('bahanAlatTerpakai')
            .orderByChild('pengujian')
            .equalTo('TPC')
            .once('value', snap1 => {
              if (snap1.val()) {
                // update data
                const b = [];
                snap1.forEach(el => {
                  b.push(el.val())
                });
                const c = []
                c.push(JSON.parse(b[0].item))
                const d = {}
                d['AQUADEST'] = parseInt(a[0].AQUADEST, 10) + parseInt(c[0].AQUADEST, 10)
                d['BPW'] = parseInt(a[0].BPW, 10) + parseInt(c[0].BPW, 10)
                d['CAWAN_PETRI'] = parseInt(a[0].CAWAN_PETRI, 10) + parseInt(c[0].CAWAN_PETRI, 10)
                d['COLONY_COUNTER'] = parseInt(a[0].COLONY_COUNTER, 10) + parseInt(c[0].COLONY_COUNTER, 10)
                d['FINTIPP'] = parseInt(a[0].FINTIPP, 10) + parseInt(c[0].FINTIPP, 10)
                d['HOT_PLATE_STIRER'] = parseInt(a[0].HOT_PLATE_STIRER, 10) + parseInt(c[0].HOT_PLATE_STIRER, 10)
                d['INKUBATOR'] = parseInt(a[0].INKUBATOR, 10) + parseInt(c[0].INKUBATOR, 10)
                d['KERTAS_TIMBANG'] = parseInt(a[0].KERTAS_TIMBANG, 10) + parseInt(c[0].KERTAS_TIMBANG, 10)
                d['LAMINAR_AIRFLOW'] = parseInt(a[0].LAMINAR_AIRFLOW, 10) + parseInt(c[0].LAMINAR_AIRFLOW, 10)
                d['MICROWAVE'] = parseInt(a[0].MICROWAVE, 10) + parseInt(c[0].MICROWAVE, 10)
                d['PCA'] = parseInt(a[0].PCA, 10) + parseInt(c[0].PCA, 10)
                d['PH_METER'] = parseInt(a[0].PH_METER, 10) + parseInt(c[0].PH_METER, 10)
                d['PLASTIK_SAMPEL'] = parseInt(a[0].PLASTIK_SAMPEL, 10) + parseInt(c[0].PLASTIK_SAMPEL, 10)
                d['PLASTIK_STOMACHER'] = parseInt(a[0].PLASTIK_STOMACHER, 10) + parseInt(c[0].PLASTIK_STOMACHER, 10)
                d['SCALPEL'] = parseInt(a[0].SCALPEL, 10) + parseInt(c[0].SCALPEL, 10)
                d['STOMACHER'] = parseInt(a[0].STOMACHER, 10) + parseInt(c[0].STOMACHER, 10)
                d['TABUNG_REAKSI'] = parseInt(a[0].TABUNG_REAKSI, 10) + parseInt(c[0].TABUNG_REAKSI, 10)
                d['TIMBANGAN_ELEKTRIK'] = parseInt(a[0].TIMBANGAN_ELEKTRIK, 10) + parseInt(c[0].TIMBANGAN_ELEKTRIK, 10)
                d['VORTEX'] = parseInt(a[0].VORTEX, 10) + parseInt(c[0].VORTEX, 10)
                this.props.firebase.db.ref('bahanAlatTerpakai/' + Object.keys(snap1.val())[0]).update({
                  item: JSON.stringify(d),
                })
              } else {
                // new data
                const z = this.props.firebase.db.ref('bahanAlatTerpakai').push();
                delete a[0].idZItems
                delete a[0].idPermohonanUji
                delete a[0].pengujian
                this.props.firebase.db.ref('bahanAlatTerpakai/' + z.key).update({
                  item: JSON.stringify(a[0]),
                  pengujian: 'TPC',
                  tanggalSelesaiAnalisa: new Date(),
                })
              }
            })
        }
        // RTK_SALMONELLA && SALMONELLA
        if (this.state.thisR === 'RAPID TEST KIT' && this.state.thisS === 'Salmonella') {
          this.props.firebase.db.ref('bahanAlatTerpakai')
            .orderByChild('pengujian')
            .equalTo('RTK_SALMONELLA')
            .once('value', snap1 => {
              if (snap1.val()) {
                // update data
                const b = [];
                snap1.forEach(el => {
                  b.push(el.val())
                });
                const c = []
                c.push(JSON.parse(b[0].item))
                const d = {}
                d['AQUADEST'] = parseInt(a[0].AQUADEST, 10) + parseInt(c[0].AQUADEST, 10)
                d['BPW'] = parseInt(a[0].BPW, 10) + parseInt(c[0].BPW, 10)
                d['KIT_SALMONELLA'] = parseInt(a[0].KIT_SALMONELLA, 10) + parseInt(c[0].KIT_SALMONELLA, 10)
                d['PLASTIK_STOMACHER'] = parseInt(a[0].PLASTIK_STOMACHER, 10) + parseInt(c[0].PLASTIK_STOMACHER, 10)
                d['JUMLAH_FINTIPP'] = parseInt(a[0].JUMLAH_FINTIPP, 10) + parseInt(c[0].JUMLAH_FINTIPP, 10)
                d['JUMLAH_SCALPEL'] = parseInt(a[0].JUMLAH_SCALPEL, 10) + parseInt(c[0].JUMLAH_SCALPEL, 10)
                d['MIKROPIPETTE'] = parseInt(a[0].MIKROPIPETTE, 10) + parseInt(c[0].MIKROPIPETTE, 10)
                d['TIMBANGAN_ELEKTRIK'] = parseInt(a[0].TIMBANGAN_ELEKTRIK, 10) + parseInt(c[0].TIMBANGAN_ELEKTRIK, 10)
                d['STOMACHER'] = parseInt(a[0].STOMACHER, 10) + parseInt(c[0].STOMACHER, 10)
                d['HOT_PLATE_STIRER'] = parseInt(a[0].HOT_PLATE_STIRER, 10) + parseInt(c[0].HOT_PLATE_STIRER, 10)
                d['MICROWAVE'] = parseInt(a[0].MICROWAVE, 10) + parseInt(c[0].MICROWAVE, 10)
                d['GELAS_UKUR'] = parseInt(a[0].GELAS_UKUR, 10) + parseInt(c[0].GELAS_UKUR, 10)
                d['PH_METER'] = parseInt(a[0].PH_METER, 10) + parseInt(c[0].PH_METER, 10)
                d['PINGSET'] = parseInt(a[0].PINGSET, 10) + parseInt(c[0].PINGSET, 10)
                d['GUNTING'] = parseInt(a[0].GUNTING, 10) + parseInt(c[0].GUNTING, 10)
                d['BUNSEN_SPIRTUS'] = parseInt(a[0].BUNSEN_SPIRTUS, 10) + parseInt(c[0].BUNSEN_SPIRTUS, 10)
                this.props.firebase.db.ref('bahanAlatTerpakai/' + Object.keys(snap1.val())[0]).update({
                  item: JSON.stringify(d),
                })
              } else {
                // new data
                delete a[0].idZItems
                delete a[0].idPermohonanUji
                delete a[0].pengujian
                const z = this.props.firebase.db.ref('bahanAlatTerpakai').push();
                this.props.firebase.db.ref('bahanAlatTerpakai/' + z.key).update({
                  item: JSON.stringify(a[0]),
                  pengujian: 'RTK_SALMONELLA',
                  tanggalSelesaiAnalisa: new Date(),
                })
              }
            })
        }
        // ELISA
        if (this.state.thisR === 'ELISA BVD' || this.state.thisR === 'ELISA RABIES' || this.state.thisR === 'ELISA PARATB') {
          this.props.firebase.db.ref('bahanAlatTerpakai')
            .orderByChild('pengujian')
            .equalTo('ELISA')
            .once('value', snap1 => {
              if (snap1.val()) {
                // update data
                const b = [];
                snap1.forEach(el => {
                  b.push(el.val())
                });
                const c = []
                c.push(JSON.parse(b[0].item))
                const d = {}
                d['AQUADEST'] = parseInt(a[0].AQUADEST, 10) + parseInt(c[0].AQUADEST, 10)
                d['ELISA_READER'] = parseInt(a[0].ELISA_READER, 10) + parseInt(c[0].ELISA_READER, 10)
                d['INKUBATOR'] = parseInt(a[0].INKUBATOR, 10) + parseInt(c[0].INKUBATOR, 10)
                d['KONJUGAT'] = parseInt(a[0].KONJUGAT, 10) + parseInt(c[0].KONJUGAT, 10)
                d['K_NEG'] = parseInt(a[0].K_NEG, 10) + parseInt(c[0].K_NEG, 10)
                d['K_POS'] = parseInt(a[0].K_POS, 10) + parseInt(c[0].K_POS, 10)
                d['LAMINAR_AIRFLOW'] = parseInt(a[0].LAMINAR_AIRFLOW, 10) + parseInt(c[0].LAMINAR_AIRFLOW, 10)
                d['PBS_TWEEN'] = parseInt(a[0].PBS_TWEEN, 10) + parseInt(c[0].PBS_TWEEN, 10)
                d['STOP_SOLUTION'] = parseInt(a[0].STOP_SOLUTION, 10) + parseInt(c[0].STOP_SOLUTION, 10)
                d['ST_1_EU'] = parseInt(a[0].ST_1_EU, 10) + parseInt(c[0].ST_1_EU, 10)
                d['SUBSTRAK'] = parseInt(a[0].SUBSTRAK, 10) + parseInt(c[0].SUBSTRAK, 10)
                d['PH_METER'] = parseInt(a[0].PH_METER, 10) + parseInt(c[0].PH_METER, 10)
                d['VORTEX'] = parseInt(a[0].VORTEX, 10) + parseInt(c[0].VORTEX, 10)
                this.props.firebase.db.ref('bahanAlatTerpakai/' + Object.keys(snap1.val())[0]).update({
                  item: JSON.stringify(d),
                })
              } else {
                // new data
                const z = this.props.firebase.db.ref('bahanAlatTerpakai').push();
                this.props.firebase.db.ref('bahanAlatTerpakai/' + z.key).update({
                  item: JSON.stringify(a[0]),
                  pengujian: 'ELISA',
                  tanggalSelesaiAnalisa: new Date(),
                })
              }
            })
        }
        // RT_PCR
        if (this.state.thisR === 'RT-PCR') {
          this.props.firebase.db.ref('bahanAlatTerpakai')
            .orderByChild('pengujian')
            .equalTo('RT_PCR')
            .once('value', snap1 => {
              if (snap1.val()) {
                // update data
                const b = [];
                snap1.forEach(el => {
                  b.push(el.val())
                });
                const c = []
                c.push(JSON.parse(b[0].item))
                const d = {}
                d['RNASE_FREE_WATER'] = parseInt(a[0].RNASE_FREE_WATER, 10) + parseInt(c[0].RNASE_FREE_WATER, 10)
                d['QUANTITECT_PROB_RT_PCR_MASTER_MIX'] = parseInt(a[0].QUANTITECT_PROB_RT_PCR_MASTER_MIX, 10) + parseInt(c[0].QUANTITECT_PROB_RT_PCR_MASTER_MIX, 10)
                d['PRIMER_AL_F'] = parseInt(a[0].PRIMER_AL_F, 10) + parseInt(c[0].PRIMER_AL_F, 10)
                d['PRIMER_AL_R'] = parseInt(a[0].PRIMER_AL_R, 10) + parseInt(c[0].PRIMER_AL_R, 10)
                d['PROB_AL'] = parseInt(a[0].PROB_AL, 10) + parseInt(c[0].PROB_AL, 10)
                d['QUANTITECH_RT_MIX'] = parseInt(a[0].QUANTITECH_RT_MIX, 10) + parseInt(c[0].QUANTITECH_RT_MIX, 10)
                d['RNA_AVE'] = parseInt(a[0].RNA_AVE, 10) + parseInt(c[0].RNA_AVE, 10)
                d['BUFFER_AVL'] = parseInt(a[0].BUFFER_AVL, 10) + parseInt(c[0].BUFFER_AVL, 10)
                d['BUFFER_AW1'] = parseInt(a[0].BUFFER_AW1, 10) + parseInt(c[0].BUFFER_AW1, 10)
                d['BUFFER_AW2'] = parseInt(a[0].BUFFER_AW2, 10) + parseInt(c[0].BUFFER_AW2, 10)
                d['BUFFER_AVE'] = parseInt(a[0].BUFFER_AVE, 10) + parseInt(c[0].BUFFER_AVE, 10)
                d['ETHANOL_96_100'] = parseInt(a[0].ETHANOL_96_100, 10) + parseInt(c[0].ETHANOL_96_100, 10)
                d['TUBE_2ML'] = parseInt(a[0].TUBE_2ML, 10) + parseInt(c[0].TUBE_2ML, 10)
                d['QIACUBE'] = parseInt(a[0].QIACUBE, 10) + parseInt(c[0].QIACUBE, 10)
                d['FINTIPP'] = parseInt(a[0].FINTIPP, 10) + parseInt(c[0].FINTIPP, 10)
                d['MIKROPIPETTE_100UL'] = parseInt(a[0].MIKROPIPETTE_100UL, 10) + parseInt(c[0].MIKROPIPETTE_100UL, 10)
                d['MIKROPIPETTE_10UL'] = parseInt(a[0].MIKROPIPETTE_10UL, 10) + parseInt(c[0].MIKROPIPETTE_10UL, 10)
                d['SPIN_DOWN'] = parseInt(a[0].SPIN_DOWN, 10) + parseInt(c[0].SPIN_DOWN, 10)
                d['VORTEX'] = parseInt(a[0].VORTEX, 10) + parseInt(c[0].VORTEX, 10)
                d['SENTRIFUGE'] = parseInt(a[0].SENTRIFUGE, 10) + parseInt(c[0].SENTRIFUGE, 10)
                d['PCR_HOOD'] = parseInt(a[0].PCR_HOOD, 10) + parseInt(c[0].PCR_HOOD, 10)
                d['ROTOR_GENE_Q'] = parseInt(a[0].ROTOR_GENE_Q, 10) + parseInt(c[0].ROTOR_GENE_Q, 10)
                this.props.firebase.db.ref('bahanAlatTerpakai/' + Object.keys(snap1.val())[0]).update({
                  item: JSON.stringify(d),
                })
              } else {
                // new data
                const z = this.props.firebase.db.ref('bahanAlatTerpakai').push();
                this.props.firebase.db.ref('bahanAlatTerpakai/' + z.key).update({
                  item: JSON.stringify(a[0]),
                  pengujian: 'RT_PCR',
                  tanggalSelesaiAnalisa: new Date(),
                })
              }
            })
        }
        // RTK_ECOLI && ECOLI
        if (this.state.thisR === 'RAPID TEST KIT' && this.state.thisS === 'E. Coli') {
          this.props.firebase.db.ref('bahanAlatTerpakai')
            .orderByChild('pengujian')
            .equalTo('RTK_ECOLI')
            .once('value', snap1 => {
              if (snap1.val()) {
                // update data
                const b = [];
                snap1.forEach(el => {
                  b.push(el.val())
                });
                const c = []
                c.push(JSON.parse(b[0].item))
                const d = {}
                d['AQUADEST'] = parseInt(a[0].AQUADEST, 10) + parseInt(c[0].AQUADEST, 10)
                d['BPW'] = parseInt(a[0].BPW, 10) + parseInt(c[0].BPW, 10)
                d['KIT_ECOLI'] = parseInt(a[0].KIT_ECOLI, 10) + parseInt(c[0].KIT_ECOLI, 10)
                d['PLASTIK_STOMACHER'] = parseInt(a[0].PLASTIK_STOMACHER, 10) + parseInt(c[0].PLASTIK_STOMACHER, 10)
                d['JUMLAH_FINTIPP'] = parseInt(a[0].JUMLAH_FINTIPP, 10) + parseInt(c[0].JUMLAH_FINTIPP, 10)
                d['JUMLAH_SCALPEL'] = parseInt(a[0].JUMLAH_SCALPEL, 10) + parseInt(c[0].JUMLAH_SCALPEL, 10)
                d['MIKROPIPETTE_100UL'] = parseInt(a[0].MIKROPIPETTE_100UL, 10) + parseInt(c[0].MIKROPIPETTE_100UL, 10)
                d['TIMBANGAN_ELEKTRIK'] = parseInt(a[0].TIMBANGAN_ELEKTRIK, 10) + parseInt(c[0].TIMBANGAN_ELEKTRIK, 10)
                d['STOMACHER'] = parseInt(a[0].STOMACHER, 10) + parseInt(c[0].STOMACHER, 10)
                d['HOT_PLATE_STIRER'] = parseInt(a[0].HOT_PLATE_STIRER, 10) + parseInt(c[0].HOT_PLATE_STIRER, 10)
                d['MICROWAVE'] = parseInt(a[0].MICROWAVE, 10) + parseInt(c[0].MICROWAVE, 10)
                d['GELAS_UKUR'] = parseInt(a[0].GELAS_UKUR, 10) + parseInt(c[0].GELAS_UKUR, 10)
                d['PH_METER'] = parseInt(a[0].PH_METER, 10) + parseInt(c[0].PH_METER, 10)
                d['PINGSET'] = parseInt(a[0].PINGSET, 10) + parseInt(c[0].PINGSET, 10)
                d['GUNTING'] = parseInt(a[0].GUNTING, 10) + parseInt(c[0].GUNTING, 10)
                d['BUNSEN_SPIRTUS'] = parseInt(a[0].BUNSEN_SPIRTUS, 10) + parseInt(c[0].BUNSEN_SPIRTUS, 10)
                this.props.firebase.db.ref('bahanAlatTerpakai/' + Object.keys(snap1.val())[0]).update({
                  item: JSON.stringify(d),
                })
              } else {
                // new data
                const z = this.props.firebase.db.ref('bahanAlatTerpakai').push();
                this.props.firebase.db.ref('bahanAlatTerpakai/' + z.key).update({
                  item: JSON.stringify(a[0]),
                  pengujian: 'RTK_ECOLI',
                  tanggalSelesaiAnalisa: new Date(),
                })
              }
            })
        }
        // PEWARNAAN_GIEMSA
        if (this.state.thisR === 'PEWARNAAN GIEMSA') {
          this.props.firebase.db.ref('bahanAlatTerpakai')
            .orderByChild('pengujian')
            .equalTo('PEWARNAAN_GIEMSA')
            .once('value', snap1 => {
              if (snap1.val()) {
                // update data
                const b = [];
                snap1.forEach(el => {
                  b.push(el.val())
                });
                const c = []
                c.push(JSON.parse(b[0].item))
                const d = {}
                d['AQUADEST'] = parseInt(a[0].AQUADEST, 10) + parseInt(c[0].AQUADEST, 10)
                d['BPW'] = parseInt(a[0].BPW, 10) + parseInt(c[0].BPW, 10)
                d['GIEMZA'] = parseInt(a[0].GIEMZA, 10) + parseInt(c[0].GIEMZA, 10)
                d['SLIDE'] = parseInt(a[0].SLIDE, 10) + parseInt(c[0].SLIDE, 10)
                d['PIPET_PASTEUR'] = parseInt(a[0].PIPET_PASTEUR, 10) + parseInt(c[0].PIPET_PASTEUR, 10)
                d['ETHANOL_96'] = parseInt(a[0].ETHANOL_96, 10) + parseInt(c[0].ETHANOL_96, 10)
                d['MIKROSKOPE'] = parseInt(a[0].MIKROSKOPE, 10) + parseInt(c[0].MIKROSKOPE, 10)
                d['OIL_EMERSION'] = parseInt(a[0].OIL_EMERSION, 10) + parseInt(c[0].OIL_EMERSION, 10)
                this.props.firebase.db.ref('bahanAlatTerpakai/' + Object.keys(snap1.val())[0]).update({
                  item: JSON.stringify(d),
                })
              } else {
                // new data
                const z = this.props.firebase.db.ref('bahanAlatTerpakai').push();
                this.props.firebase.db.ref('bahanAlatTerpakai/' + z.key).update({
                  item: JSON.stringify(a[0]),
                  pengujian: 'PEWARNAAN_GIEMSA',
                  tanggalSelesaiAnalisa: new Date(),
                })
              }
            })
        }



      })


  }

  updateHasilPengujian = (p, q, r, s) => {
    this.setState({ open2: true });
    this.setState({
      thisP: p, thisQ: q, thisR: r, thisS: s
    })
  };

  handleDateChange = date => {
    this.setState({ tanggalUjiSampelAnalis: date });
  };

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onChange2 = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const {
      loading, items,
      tanggalTerimaSampelAdminLab, PenerimaSampelAdminLab, ManajerTeknisAdminLab, ManajerAdministrasiAdminLab,
      tanggalUjiSampelAnalis, managerTeknisAnalis, managerAdministrasiAnalis, penyeliaAnalis, namaAnalis,
      hasilUjiSampel, keteranganSampel, penerimaSampelAnalisLab,
    } = this.state;
    const isInvalid = tanggalTerimaSampelAdminLab === '' || PenerimaSampelAdminLab === '' || ManajerTeknisAdminLab === '' ||
      ManajerAdministrasiAdminLab === '';
    const isInvalid2 = hasilUjiSampel === '';
    return (
      <div>
        {loading ? <Typography>Loading...</Typography> :
          <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
              Proses Sampel
            </Button>{' '}
            <Button component={Link}
              to={{
                pathname: `${ROUTES.ANALIS}`,
              }}
            >
              BACK
            </Button>
            {!loading && items.map((el, key) =>
              <div style={{ marginTop: 25 }} key={key}>
                <Typography variant="subtitle1" gutterBottom>Kode Unik Sample : {el.kodeUnikSampelAdminLab}</Typography>
                <Typography variant="subtitle1" gutterBottom>Tanggal Masuk Sample : {dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nomor Permohonan (IQFAST) : {el.nomorAgendaSurat}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nama Pemilik Sample : {el.namaPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Alamat Pemilik Sample : {el.alamatPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Asal/Tujuan Media Pembawa : {el.asalTujuanSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Petugas Pengambil Sampel (PPC) : {el.petugasPengambilSampel}</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Jenis Sampel</TableCell>
                      <TableCell>Jumlah Sampel</TableCell>
                      <TableCell>Kondisi Sampel</TableCell>
                      <TableCell>Metode Pengujian</TableCell>
                      <TableCell>Target Pengujian</TableCell>
                      <TableCell>Unit Pengujian</TableCell>
                      <TableCell>Hasil Pengujian</TableCell>
                      <TableCell>Action</TableCell>
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
                        <TableCell>{el.zItems[el1].unitPengujianSampel}</TableCell>
                        <TableCell>{el.zItems[el1].hasilUjiSampel}</TableCell>
                        <TableCell>
                          <Button variant="outlined" color="primary" onClick={() => this.updateHasilPengujian(el.idPermohonanUji, el1, el.zItems[el1].metodePengujianSampel, el.zItems[el1].targetPengujianSampel)}>
                            Update hasil
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
              <DialogTitle id="form-dialog-title">Proses Uji Sampel oleh Analis</DialogTitle>
              <DialogContent>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin="normal"
                    style={{ width: 350 }}
                    label="Tanggal Uji Sampel oleh Analis"
                    value={tanggalUjiSampelAnalis}
                    format={'MM/dd/yyyy'}
                    onChange={this.handleDateChange} />
                </MuiPickersUtilsProvider>
                {/* <FormControl style={{marginTop: 15}} variant="standard">
                  <InputLabel htmlFor="managerTeknisAnalis">Manajer Teknis</InputLabel>{" "}
                  <Select
                    value={managerTeknisAnalis}
                    onChange={this.onChange('managerTeknisAnalis')}
                    style={{width:400}}
                    name="managerTeknisAnalis"
                  >
                    <MenuItem value="ManajerTeknis1">Manajer Teknis1</MenuItem>
                    <MenuItem value="ManajerTeknis2">Manajer Teknis2</MenuItem>            
                  </Select>
                </FormControl>
                <FormControl style={{marginTop: 15}} variant="standard">
                  <InputLabel htmlFor="managerAdministrasiAnalis">Manajer Administrasi</InputLabel>{" "}
                  <Select
                    value={managerAdministrasiAnalis}
                    onChange={this.onChange('managerAdministrasiAnalis')}
                    style={{width:400}}
                    name="managerAdministrasiAnalis"
                  >
                    <MenuItem value="ManajerAdministrasi1">Manajer Administrasi1</MenuItem>
                    <MenuItem value="ManajerAdministrasi2">Manajer Administrasi2</MenuItem>            
                  </Select>
                </FormControl> */}
                <FormControl style={{ marginBottom: 20  }} variant="standard">
                  <InputLabel htmlFor="penyeliaAnalis">Penyelia</InputLabel>{" "}
                  <Select
                    value={penyeliaAnalis}
                    onChange={this.onChange('penyeliaAnalis')}
                    style={{ width: 400}}
                    name="penyeliaAnalis"
                  >
                    <MenuItem value="Penyelia1">Penyelia1</MenuItem>
                    <MenuItem value="Penyelia2">Penyelia2</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  id="penerimaSampelAnalisLab"
                  label="Analis"
                  style={{ width: "50%", marginBottom: 10 }}
                  variant="outlined"
                  // onChange={this.onChange}
                  disabled={true}
                  value={penerimaSampelAnalisLab}
                />
                {/* <FormControl style={{marginTop: 15}} variant="standard">
                  <InputLabel htmlFor="namaAnalis">Nama Analis</InputLabel>{" "}
                  <Select
                    value={namaAnalis}
                    onChange={this.onChange('namaAnalis')}
                    style={{width:400}}
                    name="namaAnalis"
                  >
                    <MenuItem value="Analis1">Analis1</MenuItem>
                    <MenuItem value="Analis2">Analis2</MenuItem>            
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
              aria-labelledby="form-dialog-title2"
            >
              <DialogTitle id="form-dialog-title2">Hasil Uji Sampel oleh Analis</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  id="hasilUjiSampel"
                  label="Hasil Uji Sampel"
                  value={hasilUjiSampel}
                  onChange={this.onChange2('hasilUjiSampel')}
                  fullWidth
                />
                <TextField
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


const condition = authUser => !!authUser;

const SampelAll = withFirebase(SampelAllBase);
const SampelDetail = withFirebase(SampelDetailBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);