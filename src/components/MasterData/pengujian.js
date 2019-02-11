import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


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
          <Typography variant="h5" gutterBottom>
            Master Data - Pengujian 
          </Typography>
          <Switch>
            <Route exact path={ROUTES.MASTERDATAPENGUJIANDETAIL} component={PengujianDetail} />
            <Route exact path={ROUTES.MASTERDATAPENGUJIAN} component={PengujianAll} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}

class PengujianAllBase extends Component {
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
      this.props.firebase.db.ref('masterData/pengujian')
        .on('value', snap => {
          if(snap.val()) {
            const a = [];
            snap.forEach(el => {
              a.push({
                idPengujian: el.val().idPengujian,
                jenisPengujian: el.val().jenisPengujian,
                metodePengujian: el.val().metodePengujian,
                targetPengujian: el.val().targetPengujian,
                kategoriSampel: el.val().kategoriSampel,
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
      this.props.firebase.db.ref('masterData/pengujian').off();
    }

    handleClickOpen = () => {
      this.setState({ open: true, formMode: null  });
    };
  
    handleClose = () => {
      this.setState({ open: false });
    };
  
    handleSubmit = ( propSample ) => {
      this.setState({ open: false });
      if(this.state.formMode === null ) {
        if (propSample) {
        const a = this.props.firebase.db.ref('masterData/pengujian').push();
        this.props.firebase.db.ref('masterData/pengujian/' + a.key).update({
          idPengujian: a.key,
          jenisPengujian: propSample[0].jenisPengujian,
          metodePengujian: propSample[0].metodePengujian,
          targetPengujian: propSample[0].targetPengujian,
          kategoriSampel: propSample[0].kategoriSampel,
        })
      }}
    }

    handleDelete = propSample =>
      this.props.firebase.db.ref('masterData/pengujian/' + propSample).remove();

    handleUbah = propSample => {
      this.setState({ open: true, formMode: [propSample] });
    }

    render() {
      const { items, loading } = this.state;
      return (
        <div>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Tambah Master Data - Pengujian
          </Button>
          <FormSampleList
            state={this.state.open}
            handleSubmit={this.handleSubmit}
            handleClose={() => this.handleClose()}
            formMode={this.state.formMode}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kategori Sampel</TableCell>
                <TableCell>Jenis Pengujian</TableCell>
                <TableCell>Metode Pengujian</TableCell>
                <TableCell>Target Pengujian</TableCell>
                <TableCell>Ubah</TableCell>
                <TableCell>Hapus</TableCell>
              </TableRow>
            </TableHead>
            {!loading && !!items && items.map((el, key) => 
            <TableBody key={key}>
                <TableRow>
                  <TableCell>{el.kategoriSampel}</TableCell>
                  <TableCell>{el.jenisPengujian}</TableCell>
                  <TableCell>{el.metodePengujian}</TableCell>
                  <TableCell>{el.targetPengujian}</TableCell>
                  <TableCell>
                    <Button component={Link}
                        to={{
                          pathname: `${ROUTES.MASTERDATAPENGUJIAN}/${el.idPengujian}`,
                          data: { el },
                        }}
                      >
                        Detail
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.idPengujian)}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
            </TableBody>
            )}
          </Table>
        </div>
      )
    }

}

class PengujianDetailBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      ...props.location.state,
      idPengujian: '',
      jenisPengujian: '',
      metodePengujian: '',
      targetPengujian: '',
      kategoriSampel: '',
      }; 
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    this.props.firebase.db.ref('masterData/pengujian/' + this.props.match.params.id)
      .on('value', snap => {
        console.log(snap.val());
        if(snap.val()) {
          const a = [];
          a.push(snap.val());
          this.setState({ 
            items: a,
            loading: false,
            idPengujian: snap.val().idPengujian,
            jenisPengujian: snap.val().jenisPengujian,
            metodePengujian: snap.val().metodePengujian,
            targetPengujian: snap.val().targetPengujian,
            kategoriSampel: snap.val().kategoriSampel,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
    })
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('masterData/pengujian').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true, formMode: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
      this.props.firebase.db.ref('masterData/pengujian/' + this.state.idPengujian).update({
        jenisPengujian: this.state.jenisPengujian,
        metodePengujian: this.state.metodePengujian,
        targetPengujian: this.state.targetPengujian,
        kategoriSampel: this.state.kategoriSampel,
      })
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { loading, jenisPengujian, metodePengujian, targetPengujian, kategoriSampel, items } = this.state;
    const isInvalid = jenisPengujian === '' || metodePengujian === '' || targetPengujian === '' || kategoriSampel === '';
    return (
      <div>
          <h2>Detail Sample</h2>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Ubah Master Data - Pengujian
          </Button>{' '}
          <Button color='secondary' component={Link}
              to={{
                pathname: `${ROUTES.MASTERDATAPENGUJIAN}`,
              }}
            >
              BACK
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kategori Sampel</TableCell>
                <TableCell>Jenis Pengujian</TableCell>
                <TableCell>Metode Pengujian</TableCell>
                <TableCell>Target Pengujian</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && !!items && items.map((el, key) => 
                <TableRow key={key}>
                  <TableCell>{el.kategoriSampel}</TableCell>
                  <TableCell>{el.jenisPengujian}</TableCell>
                  <TableCell>{el.metodePengujian}</TableCell>
                  <TableCell>{el.targetPengujian}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">Master Data - Pengujian</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ubah Data - Pengujian
              </DialogContentText>
              <FormControl style={{marginTop: 15}} variant="standard">
                <InputLabel htmlFor="kategoriSampel">Kategori Sampel</InputLabel>{" "}
                <Select
                  value={kategoriSampel}
                  onChange={this.onChange('kategoriSampel')}
                  style={{width:400}}
                  name="kategoriSampel"
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
              <TextField
                autoFocus
                margin="dense"
                id="jenisPengujian"
                label="Jenis Pengujian"
                value={jenisPengujian}
                onChange={this.onChange('jenisPengujian')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="metodePengujian"
                label="Metode Pengujian"
                value={ metodePengujian }
                onChange={this.onChange('metodePengujian')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="targetPengujian"
                label="Target Pengujian"
                value={targetPengujian}
                onChange={this.onChange('targetPengujian')}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="secondary">
                Cancel
              </Button>
              <Button variant='outlined' onClick={this.handleSubmit} 
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

const FormSampleList = ({ 
  state,
  handleSubmit,
  handleClose,
  formMode,
}) => (
  <div>
    <FormSampleBase
      state={state}
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      formMode={formMode}
    />
  </div>
);

class FormSampleBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jenisPengujian: '',
      metodePengujian: '',
      targetPengujian: '',
      kategoriSampel: '',
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
      jenisPengujian: this.state.jenisPengujian,
      metodePengujian: this.state.metodePengujian,
      targetPengujian: this.state.targetPengujian,
      kategoriSampel: this.state.kategoriSampel,
    })
    this.props.handleSubmit(a);
    this.setState({ 
      jenisPengujian: '',
      metodePengujian: '',
      targetPengujian: '',
      kategoriSampel: '',
     })
  }

  onCancel = () => {
    this.props.handleClose();
    this.setState({ 
      jenisPengujian: '',
      metodePengujian: '',
      targetPengujian: '',
      kategoriSampel: '',
     })
  }


  render() {
    const { jenisPengujian, metodePengujian, targetPengujian, kategoriSampel } = this.state;
    const isInvalid = jenisPengujian === '' || metodePengujian === '' || targetPengujian === '' || kategoriSampel === '';

    return (
      <Dialog
        open={this.props.state}
        onClose={this.onCancel}
        aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Master Data - Pengujian</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tambah Data
          </DialogContentText>
          <FormControl style={{marginTop: 15}} variant="standard">
            <InputLabel htmlFor="kategoriSampel">Kategori Sampel</InputLabel>{" "}
            <Select
              value={kategoriSampel}
              onChange={this.onChange('kategoriSampel')}
              style={{width:400}}
              name="kategoriSampel"
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
          <TextField
            autoFocus
            margin="dense"
            id="jenisPengujian"
            label="Jenis Pengujian"
            value={jenisPengujian}
            onChange={this.onChange('jenisPengujian')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="metodePengujian"
            label="Metode Pengujian"
            value={ metodePengujian }
            onChange={this.onChange('metodePengujian')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="targetPengujian"
            label="Target Pengujian"
            value={targetPengujian}
            onChange={this.onChange('targetPengujian')}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onCancel} color="secondary">
            Cancel
          </Button>
          <Button variant='outlined' onClick={this.onSubmit} disabled={isInvalid} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

}

const condition = authUser => !!authUser;

const PengujianAll = withFirebase(PengujianAllBase);
const PengujianDetail = withFirebase(PengujianDetailBase);


export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);