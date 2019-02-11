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
            Master Data - Sample 
          </Typography>
          <Switch>
            <Route exact path={ROUTES.MASTERDATASAMPLEDETAIL} component={SampleDetail} />
            <Route exact path={ROUTES.MASTERDATASAMPLE} component={SampleAll} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}

class SampleAllBase extends Component {
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
      this.props.firebase.db.ref('masterData/sample')
        .on('value', snap => {
          if(snap.val()) {
            const a = [];
            snap.forEach(el => {
              a.push({
                idSample: el.val().idSample,
                namaSample: el.val().namaSample,
                kodeSample: el.val().kodeSample,
                kodeIdSample: el.val().kodeIdSample,
                kategoriSample: el.val().kategoriSample,
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
      this.props.firebase.db.ref('masterData/sample').off();
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
        const a = this.props.firebase.db.ref('masterData/sample').push();
        this.props.firebase.db.ref('masterData/sample/' + a.key).update({
          idSample: a.key,
          namaSample: propSample[0].namaSample,
          kodeSample: propSample[0].kodeSample,
          kodeIdSample: propSample[0].kodeIdSample,
          kategoriSample: propSample[0].kategoriSample,
        })
      }}
    }

    handleDelete = propSample =>
      this.props.firebase.db.ref('masterData/sample/' + propSample).remove();

    handleUbah = propSample => {
      this.setState({ open: true, formMode: [propSample] });
    }

    render() {
      const { items, loading } = this.state;
      return (
        <div>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Tambah Master Data - Sample
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
                <TableCell>Kategori Sample</TableCell>
                <TableCell>Nama Sample</TableCell>
                <TableCell>Kode Sample</TableCell>
                <TableCell>Kode ID Sample</TableCell>
                {/* <TableCell>FBID</TableCell> */}
                <TableCell>Ubah</TableCell>
                <TableCell>Hapus</TableCell>
              </TableRow>
            </TableHead>
            {!loading && !!items && items.map((el, key) => 
            <TableBody key={key}>
                <TableRow>
                  <TableCell>{el.kategoriSample}</TableCell>
                  <TableCell>{el.namaSample}</TableCell>
                  <TableCell>{el.kodeSample}</TableCell>
                  <TableCell>{el.kodeIdSample}</TableCell>
                  {/* <TableCell>{el.idSample}</TableCell>  */}
                  <TableCell>
                    <Button component={Link} 
                        to={{
                          pathname: `${ROUTES.MASTERDATASAMPLE}/${el.idSample}`,
                          data: { el },
                        }}
                      >
                        Details
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.idSample)}>
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

class SampleDetailBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      ...props.location.state,
      idSample: '',
      namaSample: '',
      kodeSample: '',
      kodeIdSample: '',
      kategoriSample: '',
      }; 
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    this.props.firebase.db.ref('masterData/sample/' + this.props.match.params.id)
      .on('value', snap => {
        console.log(snap.val());
        if(snap.val()) {
          const a = [];
          a.push(snap.val());
          this.setState({ 
            items: a,
            loading: false,
            idSample: snap.val().idSample,
            namaSample: snap.val().namaSample,
            kodeSample: snap.val().kodeSample,
            kodeIdSample: snap.val().kodeIdSample,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
    })
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('masterData/sample').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true, formMode: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
      this.props.firebase.db.ref('masterData/sample/' + this.state.idSample).update({
        namaSample: this.state.namaSample,
        kodeSample: this.state.kodeSample,
        kodeIdSample: this.state.kodeIdSample,
        kategoriSample: this.state.kategoriSample,
      })
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { loading, namaSample, kodeSample, kodeIdSample, kategoriSample, items } = this.state;
    const isInvalid = namaSample === '' || kodeSample === '' || kodeIdSample === '' || kategoriSample === '';
    return (
      <div>
          <h2>Detail Sample</h2>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Ubah Master Data - Sample
          </Button>{' '}
          <Button color='secondary' component={Link}
              to={{
                pathname: `${ROUTES.MASTERDATASAMPLE}`,
              }}
            >
              BACK
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kategori Sample</TableCell>
                <TableCell>Nama Sample</TableCell>
                <TableCell>Kode Sample</TableCell>
                <TableCell>Kode ID Sample</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && !!items && items.map((el, key) => 
                <TableRow key={key}>
                  <TableCell>{el.kategoriSample}</TableCell>
                  <TableCell>{el.namaSample}</TableCell>
                  <TableCell>{el.kodeSample}</TableCell>
                  <TableCell>{el.kodeIdSample}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">Master Data - Sample</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ubah Data
              </DialogContentText>
              <FormControl style={{marginTop: 15}} variant="standard">
                <InputLabel htmlFor="kategoriSample">Kategori Sampel</InputLabel>{" "}
                <Select
                  value={kategoriSample}
                  onChange={this.onChange('kategoriSample')}
                  style={{width:400}}
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
              <TextField
                autoFocus
                margin="dense"
                id="namaSample"
                label="Nama Sample"
                value={namaSample}
                onChange={this.onChange('namaSample')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="kodeSample"
                label="Kode Sample"
                value={ kodeSample }
                onChange={this.onChange('kodeSample')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="kodeIdSample"
                label="Kode ID Sample"
                value={kodeIdSample}
                onChange={this.onChange('kodeIdSample')}
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
      namaSample: '',
      kodeSample: '',
      kodeIdSample: '',

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
      namaSample: this.state.namaSample,
      kodeSample: this.state.kodeSample,
      kodeIdSample: this.state.kodeIdSample,
      kategoriSample: this.state.kategoriSample,
    })
    this.props.handleSubmit(a);
    this.setState({ 
      namaSample: '',
      kodeSample: '',
      kodeIdSample: '',
      kategoriSample: '',
     })
  }

  onCancel = () => {
    this.props.handleClose();
    this.setState({ 
      namaSample: '',
      kodeSample: '',
      kodeIdSample: '',
      kategoriSample: '',
     })
  }


  render() {
    const { namaSample, kodeSample, kodeIdSample, kategoriSample } = this.state;
    const isInvalid = namaSample === '' || kodeSample === '' || kodeIdSample === '' || kategoriSample === '';

    return (
      <Dialog
        open={this.props.state}
        onClose={this.onCancel}
        aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Master Data - Sample</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tambah Data
          </DialogContentText>
          <FormControl style={{marginTop: 15}} variant="standard">
            <InputLabel htmlFor="kategoriSample">Kategori Sampel</InputLabel>{" "}
            <Select
              value={kategoriSample}
              onChange={this.onChange('kategoriSample')}
              style={{width:400}}
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
          <TextField
            autoFocus
            margin="dense"
            id="namaSample"
            label="Nama Sample"
            value={namaSample}
            onChange={this.onChange('namaSample')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="kodeSample"
            label="Kode Sample"
            value={ kodeSample }
            onChange={this.onChange('kodeSample')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="kodeIdSample"
            label="Kode ID Sample"
            value={kodeIdSample}
            onChange={this.onChange('kodeIdSample')}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onCancel} color="secondary">
            Cancel
          </Button>
          <Button  variant='outlined' onClick={this.onSubmit} disabled={isInvalid} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

}

const condition = authUser => !!authUser;

const SampleAll = withFirebase(SampleAllBase);
const SampleDetail = withFirebase(SampleDetailBase);


export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);