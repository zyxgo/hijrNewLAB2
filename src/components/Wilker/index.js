import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {FormIsian} from './formPermohonanUji';

class WilkerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      samples: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.db.ref('samples').on('value', snap => {
      // const samplesObject = snapshot.val();
      // console.log(samplesObject);
      const r1 = [];
      snap.forEach((el) => {
        r1.push({
          idPermohonanUji: el.val().idPermohonanUji,
          kodeUnikSample: el.val().kodeUnikSample,
          tanggalMasukSample: el.val().tanggalMasukSample,
          nomorAgendaSample: el.val().nomorAgendaSample,
          namaPemilikSample: el.val().namaPemilikSample,
          alamatPemilikSample: el.val().alamatPemilikSample,
          asalTujuanSample: el.val().asalTujuanSample,
        })
      })
      console.log(r1);
      // const samplesList = Object.keys(samplesObject).map(key => ({
      //   ...samplesObject[key],
      //   uid: key,
      // }));

      this.setState({
        samples: r1,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('samples').off();
  }

  render() {
    const { samples, loading } = this.state;

    return (
      <Grid style={{flex: 1, margin: 10}} item xs={12}>
        <Paper style={{padding: 10}}>
          <Typography variant="h5" gutterBottom>
            Wilker
          </Typography>
          {loading && <div>Loading ...</div>}
          <Typography variant="h6" gutterBottom>
            List Permohonan Pengujian
          </Typography>
          <SamplesList samples={samples} />
          <Grid item xs={6}>
            <FormIsian />
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

const SamplesList = ({ samples }) => (
  <ul>
    {samples.map(el => (
      <Paper key={el.idPermohonanUji}>
        <Typography variant="h6" gutterBottom>
            {el.kodeUnikSample}
          </Typography>
      </Paper>
    ))}
  </ul>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WilkerPage);