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
            Master Data - Wilker 
          </Typography>
          <Switch>
            <Route exact path={ROUTES.MASTERDATA_WILKERDETAIL} component={WilkerDetail} />
            <Route exact path={ROUTES.MASTERDATA_WILKER} component={WilkerAll} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}

class WilkerAllBase extends Component {
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
      this.props.firebase.db.ref('masterData/wilker')
        .on('value', snap => {
          if(snap.val()) {
            const a = [];
            snap.forEach(el => {
              a.push({
                idWilker: el.val().idWilker,
                kodeWilker: el.val().kodeWilker,
                namaWilker: el.val().namaWilker,
                countSampelWilker: el.val().countSampelWilker,
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
      this.props.firebase.db.ref('masterData/wilker').off();
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
        const a = this.props.firebase.db.ref('masterData/wilker').push();
        this.props.firebase.db.ref('masterData/wilker/' + a.key).update({
          idWilker: a.key,
          kodeWilker: propSample[0].kodeWilker,
          namaWilker: propSample[0].namaWilker,
          countSampelWilker: 0,
        })
      }}
    }

    handleDelete = propSample =>
      this.props.firebase.db.ref('masterData/wilker/' + propSample).remove();

    handleUbah = propSample => {
      this.setState({ open: true, formMode: [propSample] });
    }

    render() {
      const { items, loading } = this.state;
      return (
        <div>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Tambah Master Data - Wilker
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
                <TableCell>Kode Wilker</TableCell>
                <TableCell>Nama Wilker</TableCell>
                <TableCell>Count Sample</TableCell>
                <TableCell>Ubah</TableCell>
                <TableCell>Hapus</TableCell>
              </TableRow>
            </TableHead>
            {!loading && !!items && items.map((el, key) => 
            <TableBody key={key}>
                <TableRow>
                  <TableCell>{el.kodeWilker}</TableCell>
                  <TableCell>{el.namaWilker}</TableCell>
                  <TableCell>{el.countSampelWilker}</TableCell>
                  <TableCell>
                    <Button component={Link} 
                        to={{
                          pathname: `${ROUTES.MASTERDATA_WILKER}/${el.idWilker}`,
                          data: { el },
                        }}
                      >
                        Details
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.idWilker)}>
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

class WilkerDetailBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      ...props.location.state,
      idWilker: '',
      kodeWilker: '',
      namaWilker: '',
      // countSampelWilker: '',
      }; 
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    this.props.firebase.db.ref('masterData/wilker/' + this.props.match.params.id)
      .on('value', snap => {
        console.log(snap.val());
        if(snap.val()) {
          const a = [];
          a.push(snap.val());
          this.setState({ 
            items: a,
            loading: false,
            idWilker: snap.val().idWilker,
            kodeWilker: snap.val().kodeWilker,
            namaWilker: snap.val().namaWilker,
            countSampelWilker: snap.val().countSampelWilker,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
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
    this.setState({ open: false });
      this.props.firebase.db.ref('masterData/wilker/' + this.state.idWilker).update({
        kodeWilker: this.state.kodeWilker,
        namaWilker: this.state.namaWilker,
        // countSampelWilker: this.state.countSampelWilker,
      })
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { loading, kodeWilker, namaWilker, items } = this.state;
    const isInvalid = kodeWilker === '' || namaWilker === '';
    return (
      <div>
          <h2>Detail Sample</h2>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Ubah Master Data - Wilker
          </Button>{' '}
          <Button component={Link}
              to={{
                pathname: `${ROUTES.MASTERDATA_WILKER}`,
              }}
              color='secondary'
            >
              BACK
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kode Wilker</TableCell>
                <TableCell>Nama Wilker</TableCell>
                <TableCell>Count Sample</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && !!items && items.map((el, key) => 
                <TableRow key={key}>
                  <TableCell>{el.kodeWilker}</TableCell>
                  <TableCell>{el.namaWilker}</TableCell>
                  <TableCell>{el.countSampelWilker}</TableCell>
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
                Ubah Data - Wilker
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="kodeWilker"
                label="Kode Wilker"
                value={kodeWilker}
                onChange={this.onChange('kodeWilker')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="namaWilker"
                label="Nama Wilker"
                value={ namaWilker }
                onChange={this.onChange('namaWilker')}
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
      kodeWilker: '',
      namaWilker: '',
      // countSampelWilker: '',
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
      kodeWilker: this.state.kodeWilker,
      namaWilker: this.state.namaWilker,
      // countSampelWilker: this.state.countSampelWilker,
    })
    this.props.handleSubmit(a);
    this.setState({ 
      kodeWilker: '',
      namaWilker: '',
      // countSampelWilker: '',
     })
  }

  onCancel = () => {
    this.props.handleClose();
    this.setState({ 
      kodeWilker: '',
      namaWilker: '',
      // countSampelWilker: '',
     })
  }


  render() {
    const { kodeWilker, namaWilker } = this.state;
    const isInvalid = kodeWilker === '' || namaWilker === '';

    return (
      <Dialog
        open={this.props.state}
        onClose={this.onCancel}
        aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Master Data - Wilker</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tambah Data
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="kodeWilker"
            label="Kode Wilker"
            value={kodeWilker}
            onChange={this.onChange('kodeWilker')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="namaWilker"
            label="Nama Wilker"
            value={ namaWilker }
            onChange={this.onChange('namaWilker')}
            fullWidth
          />
          {/* <TextField
            margin="dense"
            // id="countSampelWilker"
            label="Count Sample"
            // value={countSampelWilker}
            // onChange={this.onChange('countSampelWilker')}
            fullWidth
          /> */}
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

const WilkerAll = withFirebase(WilkerAllBase);
const WilkerDetail = withFirebase(WilkerDetailBase);


export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);