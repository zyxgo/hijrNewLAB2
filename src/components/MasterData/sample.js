import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
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
            Master Data - Sample 
          </Typography>
          <Switch>
            <Route exact path={ROUTES.MASTERDATA_SAMPLEDETAIL} component={SampleDetail} />
            <Route exact path={ROUTES.MASTERDATA_SAMPLE} component={SampleAll} />
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
        }; 
    }

    componentDidMount() {
      this.setState({ loading: true });
      this.props.firebase.db.ref('masterData/sample')
        .on('value', snap => {
          // console.log(snap.val());
          if(snap.val()) {
            const a = [];
            snap.forEach(el => {
              a.push({
                idSample: el.val().idSample,
                namaSample: el.val().namaSample,
                kodeSample: el.val().kodeSample,
                kodeIdSample: el.val().kodeIdSample,
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
      this.setState({ open: true });
    };
  
    handleClose = () => {
      this.setState({ open: false });
    };
  
    handleSubmit = ( propSample ) => {
      this.setState({ open: false });
      if (propSample) {
        const a = this.props.firebase.db.ref('masterData/sample').push();
        this.props.firebase.db.ref('masterData/sample/' + a.key).update({
          idSample: a.key,
          namaSample: propSample[0].namaSample,
          kodeSample: propSample[0].kodeSample,
          kodeIdSample: propSample[0].kodeIdSample,
        })
      }
    }

    handleDelete = propSample =>
      this.props.firebase.db.ref('masterData/sample/' + propSample).remove();

    handleUbah = propSample => {
      console.log(propSample);
    }

    render() {
      const { items, loading } = this.state;
      // console.log( items, loading );
      return (
        <div>
          <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Tambah Master Data - Sample
          </Button>
          <FormSample
            state={this.state.open}
            handleSubmit={this.handleSubmit}
            handleClose={() => this.handleClose()}
            formMode={'newData'}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama Sample</TableCell>
                <TableCell>Kode Sample</TableCell>
                <TableCell>Kode ID Sample</TableCell>
                <TableCell>Ubah</TableCell>
                <TableCell>Hapus</TableCell>
              </TableRow>
            </TableHead>
            {!loading && !!items && items.map((el, key) => 
            <TableBody key={key}>
                <TableRow>
                  <TableCell>{el.namaSample}</TableCell>
                  <TableCell>{el.kodeSample}</TableCell>
                  <TableCell>{el.kodeIdSample}</TableCell>
                  <TableCell>
                    <Button variant="text" color="primary" onClick={() => this.handleUbah(el.idSample)}>
                      Ubah
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

class SampleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      items: [],
      }; 
  }

  render() {
    return (
      <div>
          <h2>Detail Sample</h2>
      </div>
    )
  }

}

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

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onSubmit = () => {
    const a = [];
    a.push({
      namaSample: this.state.namaSample,
      kodeSample: this.state.kodeSample,
      kodeIdSample: this.state.kodeIdSample,
    })
    this.props.handleSubmit(a);
  }

  render() {
    return (
      <Dialog
        open={this.props.state}
        onClose={this.props.handleClose}
        aria-labelledby="form-dialog-title"
        >
        <DialogTitle id="form-dialog-title">Tambah Master Data - Sample</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tambahkan 
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="namaSample"
            label="Nama Sample"
            onChange={this.onChange}
            fullWidth
          />
          <TextField
            // autoFocus
            margin="dense"
            id="kodeSample"
            label="Kode Sample"
            onChange={this.onChange}
            fullWidth
          />
          <TextField
            // autoFocus
            margin="dense"
            id="kodeIdSample"
            label="Kode ID Sample"
            onChange={this.onChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

}

const condition = authUser => !!authUser;

const FormSample = withFirebase(FormSampleBase);
const SampleAll = withFirebase(SampleAllBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);