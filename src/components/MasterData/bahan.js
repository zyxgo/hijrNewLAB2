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
            Master Data - Bahan 
          </Typography>
          <Switch>
            <Route exact path={ROUTES.MASTERDATA_BAHANDETAIL} component={BahanDetail} />
            <Route exact path={ROUTES.MASTERDATA_BAHAN} component={BahanAll} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}

class BahanAllBase extends Component {
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
      this.props.firebase.db.ref('masterData/bahan')
        .on('value', snap => {
          if(snap.val()) {
            const a = [];
            snap.forEach(el => {
              a.push({
                idBahan: el.val().idBahan,
                kodeBahan: el.val().kodeBahan,
                namaBahan: el.val().namaBahan,
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
      this.props.firebase.db.ref('masterData/bahan').off();
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
        const a = this.props.firebase.db.ref('masterData/bahan').push();
        this.props.firebase.db.ref('masterData/bahan/' + a.key).update({
          idBahan: a.key,
          kodeBahan: propSample[0].kodeBahan,
          namaBahan: propSample[0].namaBahan,
        })
      }}
    }

    handleDelete = propSample =>
      this.props.firebase.db.ref('masterData/bahan/' + propSample).remove();

    handleUbah = propSample => {
      this.setState({ open: true, formMode: [propSample] });
    }

    render() {
      const { items, loading } = this.state;
      return (
        <div>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Tambah Master Data - Bahan
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
                <TableCell>Kode Bahan</TableCell>
                <TableCell>Nama Bahan</TableCell>
                <TableCell>Ubah</TableCell>
                <TableCell>Hapus</TableCell>
              </TableRow>
            </TableHead>
            {!loading && !!items && items.map((el, key) => 
            <TableBody key={key}>
                <TableRow>
                  <TableCell>{el.kodeBahan}</TableCell>
                  <TableCell>{el.namaBahan}</TableCell>
                  <TableCell>
                    <Button component={Link} 
                        to={{
                          pathname: `${ROUTES.MASTERDATA_BAHAN}/${el.idBahan}`,
                          data: { el },
                        }}
                      >
                        Details
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.idBahan)}>
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

class BahanDetailBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      ...props.location.state,
      idBahan: '',
      kodeBahan: '',
      namaBahan: '',
      }; 
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.db.ref('masterData/bahan/' + this.props.match.params.id)
      .on('value', snap => {
        console.log(snap.val());
        if(snap.val()) {
          const a = [];
          a.push(snap.val());
          this.setState({ 
            items: a,
            loading: false,
            idBahan: snap.val().idBahan,
            kodeBahan: snap.val().kodeBahan,
            namaBahan: snap.val().namaBahan,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
    })
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('masterData/bahan').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true, formMode: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
      this.props.firebase.db.ref('masterData/bahan/' + this.state.idBahan).update({
        kodeBahan: this.state.kodeBahan,
        namaBahan: this.state.namaBahan,
      })
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { loading, kodeBahan, namaBahan, items } = this.state;
    const isInvalid = kodeBahan === '' || namaBahan === '';
    return (
      <div>
          <h2>Detail Sample</h2>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Ubah Master Data - Bahan
          </Button>{' '}
          <Button component={Link}
              to={{
                pathname: `${ROUTES.MASTERDATA_BAHAN}`,
              }}
              color='secondary'
            >
              BACK
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kode Bahan</TableCell>
                <TableCell>Nama Bahan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && !!items && items.map((el, key) => 
                <TableRow key={key}>
                  <TableCell>{el.kodeBahan}</TableCell>
                  <TableCell>{el.namaBahan}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">Master Data - Bahan</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Ubah Data - Bahan
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="kodeBahan"
                label="Kode Bahan"
                value={kodeBahan}
                onChange={this.onChange('kodeBahan')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="namaBahan"
                label="Nama Bahan"
                value={ namaBahan }
                onChange={this.onChange('namaBahan')}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={this.handleSubmit} 
                disabled={isInvalid} 
                variant='outlined'
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
      kodeBahan: '',
      namaBahan: '',
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
      kodeBahan: this.state.kodeBahan,
      namaBahan: this.state.namaBahan,
    })
    this.props.handleSubmit(a);
    this.setState({ 
      kodeBahan: '',
      namaBahan: '',
     })
  }

  onCancel = () => {
    this.props.handleClose();
    this.setState({ 
      kodeBahan: '',
      namaBahan: '',
     })
  }


  render() {
    const { kodeBahan, namaBahan } = this.state;
    const isInvalid = kodeBahan === '' || namaBahan === '';

    return (
      <Dialog
        open={this.props.state}
        onClose={this.onCancel}
        aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Master Data - Bahan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tambah Data
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="kodeBahan"
            label="Kode Bahan"
            value={kodeBahan}
            onChange={this.onChange('kodeBahan')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="namaBahan"
            label="Nama Bahan"
            value={ namaBahan }
            onChange={this.onChange('namaBahan')}
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

const BahanAll = withFirebase(BahanAllBase);
const BahanDetail = withFirebase(BahanDetailBase);


export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);