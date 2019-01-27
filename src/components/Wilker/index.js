import React, { Component } from 'react';
// import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {FormIsian} from './formPermohonanUji';
import {FormIsianDetail} from './formPermohonanUjiDetail';
import {FormIsianDetailView} from './formPermohonanUjiDetailView';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class WilkerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      samples: [],
      itemSamples : [],
      newSample: null,
      updateNewSample: false,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.db.ref('samples').on('value', snap => {
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
      this.setState({
        samples: r1,
        loading: false,
      });
    });

    // this.updateResultFormPengujian(this.state.newSample);
    // console.log(this.state.itemSamples);
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('samples').off();
  }

  updateResultFormPengujian = newSample => {
    this.props.firebase.db.ref('samples/' + newSample).on('value', snap => {
      const r1 = [];
      r1.push(snap.val());
      // snap.forEach((el) => {
      //   r1.push({
      //     idPermohonanUji: el.val().idPermohonanUji,
      //     kodeUnikSample: el.val().kodeUnikSample,
      //     tanggalMasukSample: el.val().tanggalMasukSample,
      //     nomorAgendaSample: el.val().nomorAgendaSample,
      //     namaPemilikSample: el.val().namaPemilikSample,
      //     alamatPemilikSample: el.val().alamatPemilikSample,
      //     asalTujuanSample: el.val().asalTujuanSample,
      //   })
      // })
      this.setState({
        itemSamples: r1,
        loading: false,
      });
    });
  }

  getNewIdSampleFromChild = newId => {
    // console.log(newId);
    this.setState({newSample: newId});
  }

  render() {
    const { newSample } = this.state;

    return (
      <Grid style={{flex: 1, margin: 10}} item xs={12}>
        <Paper style={{padding: 10}}>
          <Typography variant="h5" gutterBottom>
            Wilker
          </Typography>
          {/* <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>All List Permohonan Pengujian</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography variant="h6" gutterBottom>
                List Permohonan Pengujian
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel> */}
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Form Permohonan Pengujian Header Sample</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid item xs={6}>
                <FormIsian newIdSample={this.getNewIdSampleFromChild}/>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Form Permohonan Pengujian Detail Sample</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid item xs={6}>
                <FormIsianDetail newIdSamplex={this.state.newSample} />
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Result Permohonan Pengujian Detail</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  Result Form Permohonan Pengujian
                </Typography>
                {/* <Typography>{this.state.newSample}</Typography> */}
                {this.state.newSample !== null && <FormIsianDetailView newIdSamplex={newSample} />}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Paper>
      </Grid>
    );
  }
}

// const SamplesList = ({ samples }) => (
//   <ul>
//     {samples.map(el => (
//       <Paper key={el.idPermohonanUji}>
//         <Typography variant="h6" gutterBottom>
//           {el.kodeUnikSample}
//         </Typography>
//       </Paper>
//     ))}
//   </ul>
// );

const condition = authUser => !!authUser;

export default withAuthorization(condition)(WilkerPage);