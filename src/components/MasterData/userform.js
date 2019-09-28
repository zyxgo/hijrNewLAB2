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
            Master Data - User Form 
          </Typography>
          <Switch>
            <Route exact path={ROUTES.MASTERDATA_USERFORMDETAIL} component={PageDetail} />
            <Route exact path={ROUTES.MASTERDATA_USERFORM} component={PageAll} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}

class PageAllBase extends Component {
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
      this.props.firebase.db.ref('masterData/userform')
        .on('value', snap => {
          if(snap.val()) {
            const a = [];
            snap.forEach(el => {
              a.push({
                idUserForm: el.val().idUserForm,
                namaUserForm: el.val().namaUserForm,
                nipUserForm: el.val().nipUserForm,
                jabatanUserForm: el.val().jabatanUserForm,
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
      this.props.firebase.db.ref('masterData/userform').off();
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
        const a = this.props.firebase.db.ref('masterData/userform').push();
        this.props.firebase.db.ref('masterData/userform/' + a.key).update({
          idUserForm: a.key,
          namaUserForm: propSample[0].namaUserForm,
          nipUserForm: propSample[0].nipUserForm,
          jabatanUserForm: propSample[0].jabatanUserForm,
        })
      }}
    }

    handleDelete = propSample =>
      this.props.firebase.db.ref('masterData/userform/' + propSample).remove();

    handleUbah = propSample => {
      this.setState({ open: true, formMode: [propSample] });
    }

    render() {
      const { items, loading } = this.state;
      return (
        <div>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Tambah Master Data - User Form
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
                <TableCell>Nama</TableCell>
                <TableCell>NIP</TableCell>
                <TableCell>Jabatan</TableCell>
                <TableCell>Detail</TableCell>
                <TableCell>Hapus</TableCell>
              </TableRow>
            </TableHead>
            {!loading && !!items && items.map((el, key) => 
            <TableBody key={key}>
                <TableRow>
                  <TableCell>{el.namaUserForm}</TableCell>
                  <TableCell>{el.nipUserForm}</TableCell>
                  <TableCell>{el.jabatanUserForm}</TableCell>
                  <TableCell>
                    <Button component={Link} 
                        to={{
                          pathname: `${ROUTES.MASTERDATA_USERFORM}/${el.idUserForm}`,
                          data: { el },
                        }}
                      >
                        Detail
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.idUserForm)}>
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

class PageDetailBase extends Component {
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
    this.props.firebase.db.ref('masterData/userform/' + this.props.match.params.id)
      .on('value', snap => {
        // console.log(snap.val());
        if(snap.val()) {
          const a = [];
          a.push(snap.val());
          this.setState({ 
            items: a,
            loading: false,
            idUserForm: snap.val().idUserForm,
            namaUserForm: snap.val().namaUserForm,
            nipUserForm: snap.val().nipUserForm,
            jabatanUserForm: snap.val().jabatanUserForm,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
    })
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('masterData/userform').off();
  }

  handleClickOpen = () => {
    this.setState({ open: true, formMode: null  });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
      this.props.firebase.db.ref('masterData/userform/' + this.state.idUserForm).update({
        namaUserForm: this.state.namaUserForm,
        nipUserForm: this.state.nipUserForm,
        jabatanUserForm: this.state.jabatanUserForm,
      })
  }

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { loading, namaUserForm, nipUserForm, jabatanUserForm, items } = this.state;
    const isInvalid = namaUserForm === '' || nipUserForm === '' || jabatanUserForm === '';
    return (
      <div>
          <h2>Detail User Form</h2>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Ubah Master Data - User Form
          </Button>{' '}
          <Button component={Link}
              to={{
                pathname: `${ROUTES.MASTERDATA_USERFORM}`,
              }}
              color='secondary'
            >
              BACK
          </Button>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>NIP</TableCell>
                <TableCell>Jabatan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading && !!items && items.map((el, key) => 
                <TableRow key={key}>
                  <TableCell>{el.namaUserForm}</TableCell>
                  <TableCell>{el.nipUserForm}</TableCell>
                  <TableCell>{el.jabatanUserForm}</TableCell>
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
                Ubah Data - User Form
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="namaUserForm"
                label="Nama"
                value={namaUserForm}
                onChange={this.onChange('namaUserForm')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="nipUserForm"
                label="NIP"
                value={ nipUserForm }
                onChange={this.onChange('nipUserForm')}
                fullWidth
              />
              <TextField
                margin="dense"
                id="jabatanUserForm"
                label="Jabatan"
                value={ jabatanUserForm }
                onChange={this.onChange('jabatanUserForm')}
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
      namaUserForm: '',
      nipUserForm: '',
      jabatanUserForm: '',
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
      namaUserForm: this.state.namaUserForm,
      nipUserForm: this.state.nipUserForm,
      jabatanUserForm: this.state.jabatanUserForm,
    })
    this.props.handleSubmit(a);
    this.setState({ 
      namaUserForm: '',
      nipUserForm: '',
      jabatanUserForm: '',
     })
  }

  onCancel = () => {
    this.props.handleClose();
    this.setState({ 
      namaUserForm: '',
      nipUserForm: '',
      jabatanUserForm: '',
     })
  }


  render() {
    const { namaUserForm, nipUserForm, jabatanUserForm } = this.state;
    const isInvalid = namaUserForm === '' || nipUserForm === '' || jabatanUserForm === '';

    return (
      <Dialog
        open={this.props.state}
        onClose={this.onCancel}
        aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Master Data - User Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tambah Data
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="namaUserForm"
            label="Nama"
            value={namaUserForm}
            onChange={this.onChange('namaUserForm')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="nipUserForm"
            label="NIP"
            value={ nipUserForm }
            onChange={this.onChange('nipUserForm')}
            fullWidth
          />
          <TextField
            margin="dense"
            id="jabatanUserForm"
            label="Jabatan"
            value={ jabatanUserForm }
            onChange={this.onChange('jabatanUserForm')}
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

const PageAll = withFirebase(PageAllBase);
const PageDetail = withFirebase(PageDetailBase);


export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);