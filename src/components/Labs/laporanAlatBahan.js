import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROUTES from '../../constants/routes';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
            Pemakaian Alat Bahan
          </Typography>
          <Switch>
            {/* <Route exact path={ROUTES.ANALIS_ALATBAHAN_DETAIL} component={SampelDetail} /> */}
            <Route exact path={ROUTES.ANALIS_ALATBAHAN} component={SampelAll} />
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
      this.props.firebase.db.ref('bahanAlatTerpakai')
        // .orderByChild('flagStatusProses')
        // .equalTo('Sampel di Analis')
        .on('value', snap => {
          if(snap.val()) {
            const a = [];
            snap.forEach(el => {
              a.push({
                pengujian: el.val().pengujian,
                item: el.val().item
              })
            });
            // console.log(a[0])
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
      this.props.firebase.db.ref('bahanTerpakai').off();
    }

    render() {
      const { items, loading } = this.state;
      // console.log(items)
      return (
        <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading ? <Typography>Loading...</Typography> : 
              <div>
                {!loading && !!items && items.map((el, key) => 
                  <Table key={key}>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Typography variant="h6" gutterBottom>PENGUJIAN : {el.pengujian}</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow><TableCell>  BAHAN</TableCell></TableRow>
                      {!!JSON.parse(el.item).AQUADEST && 
                        <TableRow><TableCell>   - AQUADEST : {JSON.parse(el.item).AQUADEST}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).BPW && 
                        <TableRow><TableCell>   - BPW : {JSON.parse(el.item).BPW}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PCA && 
                        <TableRow><TableCell>   - PCA : {JSON.parse(el.item).PCA}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).KIT_SALMONELLA && 
                        <TableRow><TableCell>   - KIT_SALMONELLA : {JSON.parse(el.item).KIT_SALMONELLA}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).KIT_E_COLI && 
                        <TableRow><TableCell>   - KIT_E_COLI : {JSON.parse(el.item).KIT_E_COLI}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).GIEMZA && 
                        <TableRow><TableCell>   - GIEMZA : {JSON.parse(el.item).GIEMZA}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).SLIDE && 
                        <TableRow><TableCell>   - SLIDE : {JSON.parse(el.item).SLIDE}</TableCell></TableRow>}
                      
                      {!!JSON.parse(el.item).RNASE_FREE_WATER && 
                        <TableRow><TableCell>   - RNASE_FREE_WATER : {JSON.parse(el.item).RNASE_FREE_WATER}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).QUANTITECT_PROB_RT_PCR_MASTER_MIX && 
                        <TableRow><TableCell>   - QUANTITECT_PROB_RT_PCR_MASTER_MIX : {JSON.parse(el.item).QUANTITECT_PROB_RT_PCR_MASTER_MIX}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PRIMER_AL_F && 
                        <TableRow><TableCell>   - PRIMER_AL_F : {JSON.parse(el.item).PRIMER_AL_F}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PRIMER_AL_R && 
                        <TableRow><TableCell>   - PRIMER_AL_R : {JSON.parse(el.item).PRIMER_AL_R}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PROB_AL && 
                        <TableRow><TableCell>   - PROB_AL : {JSON.parse(el.item).PROB_AL}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).QUANTITECT_RT_MIX && 
                        <TableRow><TableCell>   - QUANTITECT_RT_MIX : {JSON.parse(el.item).QUANTITECT_RT_MIX}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).RNA_AVE && 
                        <TableRow><TableCell>   - RNA_AVE : {JSON.parse(el.item).RNA_AVE}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).BUFFER_AVL && 
                        <TableRow><TableCell>   - BUFFER_AVL : {JSON.parse(el.item).BUFFER_AVL}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).BUFFER_AW1 && 
                        <TableRow><TableCell>   - BUFFER_AW1 : {JSON.parse(el.item).BUFFER_AW1}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).BUFFER_AW2 && 
                        <TableRow><TableCell>   - BUFFER_AW2 : {JSON.parse(el.item).BUFFER_AW2}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).BUFFER_AVE && 
                        <TableRow><TableCell>   - BUFFER_AVE : {JSON.parse(el.item).BUFFER_AVE}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).ETHANOL_96_100 && 
                        <TableRow><TableCell>   - ETHANOL_96_100 : {JSON.parse(el.item).ETHANOL_96_100}</TableCell></TableRow>}
                      
                      {!!JSON.parse(el.item).TABUNG_REAKSI && 
                        <TableRow><TableCell>   - TABUNG_REAKSI : {JSON.parse(el.item).TABUNG_REAKSI}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).CAWAN_PETRI && 
                        <TableRow><TableCell>   - CAWAN_PETRI : {JSON.parse(el.item).CAWAN_PETRI}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).KERTAS_TIMBANG && 
                        <TableRow><TableCell>   - KERTAS_TIMBANG : {JSON.parse(el.item).KERTAS_TIMBANG}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PLASTIK_STOMACHER && 
                        <TableRow><TableCell>   - PLASTIK_STOMACHER : {JSON.parse(el.item).PLASTIK_STOMACHER}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PLASTIK_SAMPEL && 
                        <TableRow><TableCell>   - PLASTIK_SAMPEL : {JSON.parse(el.item).PLASTIK_SAMPEL}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PBS_TWEEN && 
                        <TableRow><TableCell>   - PBS_TWEEN : {JSON.parse(el.item).PBS_TWEEN}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).K_POS && 
                        <TableRow><TableCell>   - K_POS : {JSON.parse(el.item).K_POS}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).K_NEG && 
                        <TableRow><TableCell>   - K_NEG : {JSON.parse(el.item).K_NEG}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).ST_1_EU && 
                        <TableRow><TableCell>   - ST_1_EU : {JSON.parse(el.item).ST_1_EU}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).KONJUGAT && 
                        <TableRow><TableCell>   - KONJUGAT : {JSON.parse(el.item).KONJUGAT}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).SUBSTRAK && 
                        <TableRow><TableCell>   - SUBSTRAK : {JSON.parse(el.item).SUBSTRAK}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).STOP_SOLUTION && 
                        <TableRow><TableCell>   - STOP_SOLUTION : {JSON.parse(el.item).STOP_SOLUTION}</TableCell></TableRow>}
                      
                      {!!JSON.parse(el.item).JUMLAH_FINTIPP && 
                        <TableRow><TableCell>   - JUMLAH_FINTIPP : {JSON.parse(el.item).JUMLAH_FINTIPP}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).JUMLAH_SCALPEL && 
                        <TableRow><TableCell>   - JUMLAH_SCALPEL : {JSON.parse(el.item).JUMLAH_SCALPEL}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).TABUNG_EFENDORF && 
                        <TableRow><TableCell>   - TABUNG_EFENDORF : {JSON.parse(el.item).TABUNG_EFENDORF}</TableCell></TableRow>}
                      
                      {/* ALAT */}
                      <TableRow><TableCell>ALAT</TableCell></TableRow>
                      {!!JSON.parse(el.item).PIPET_VOLUMETRICK_10ML && 
                        <TableRow><TableCell>   - PIPET_VOLUMETRICK_10ML : {JSON.parse(el.item).PIPET_VOLUMETRICK_10ML}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).MIKROPIPETTE_2UL && 
                        <TableRow><TableCell>   - MIKROPIPETTE_2UL : {JSON.parse(el.item).MIKROPIPETTE_2UL}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).MIKROPIPETTE_10UL && 
                        <TableRow><TableCell>   - MIKROPIPETTE_10UL : {JSON.parse(el.item).MIKROPIPETTE_10UL}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).MIKROPIPETTE_200UL && 
                        <TableRow><TableCell>   - MIKROPIPETTE_200UL : {JSON.parse(el.item).MIKROPIPETTE_200UL}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).MIKROPIPETTE_100UL && 
                        <TableRow><TableCell>   - MIKROPIPETTE_100UL : {JSON.parse(el.item).MIKROPIPETTE_100UL}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).MIKROPIPETTE_1000UL && 
                        <TableRow><TableCell>   - MIKROPIPETTE_1000UL : {JSON.parse(el.item).MIKROPIPETTE_1000UL}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).TIMBANGAN_ELEKTRIK && 
                        <TableRow><TableCell>   - TIMBANGAN_ELEKTRIK : {JSON.parse(el.item).TIMBANGAN_ELEKTRIK}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).SPIN_DOWN && 
                        <TableRow><TableCell>   - SPIN_DOWN : {JSON.parse(el.item).SPIN_DOWN}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).VORTEX && 
                        <TableRow><TableCell>   - VORTEX : {JSON.parse(el.item).VORTEX}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).SENTRIFUGE && 
                        <TableRow><TableCell>   - SENTRIFUGE : {JSON.parse(el.item).SENTRIFUGE}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PCR_HOOD && 
                        <TableRow><TableCell>   - PCR_HOOD : {JSON.parse(el.item).PCR_HOOD}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).ROTOR_GENE_Q && 
                        <TableRow><TableCell>   - ROTOR_GENE_Q : {JSON.parse(el.item).ROTOR_GENE_Q}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).STOMACHER && 
                        <TableRow><TableCell>   - STOMACHER : {JSON.parse(el.item).STOMACHER}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).HOT_PLATE_STIRER && 
                        <TableRow><TableCell>   - HOT_PLATE_STIRER : {JSON.parse(el.item).HOT_PLATE_STIRER}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).MICROWAVE && 
                        <TableRow><TableCell>   - MICROWAVE : {JSON.parse(el.item).MICROWAVE}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).GELAS_UKUR_1000ML && 
                        <TableRow><TableCell>   - GELAS_UKUR_1000ML : {JSON.parse(el.item).GELAS_UKUR_1000ML}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PORTEX && 
                        <TableRow><TableCell>   - PORTEX : {JSON.parse(el.item).PORTEX}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PH_METER && 
                        <TableRow><TableCell>   - PH_METER : {JSON.parse(el.item).PH_METER}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PINGSET && 
                        <TableRow><TableCell>   - PINGSET : {JSON.parse(el.item).PINGSET}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).GUNTING && 
                        <TableRow><TableCell>   - GUNTING : {JSON.parse(el.item).GUNTING}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).BUNSEN_SPIRTUS && 
                        <TableRow><TableCell>   - BUNSEN_SPIRTUS : {JSON.parse(el.item).BUNSEN_SPIRTUS}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).BAK_REAGEN && 
                        <TableRow><TableCell>   - BAK_REAGEN : {JSON.parse(el.item).BAK_REAGEN}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).MULTI_CHANNEL_100UL && 
                        <TableRow><TableCell>   - MULTI_CHANNEL_100UL : {JSON.parse(el.item).MULTI_CHANNEL_100UL}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).GELAS_UKUR_50ML && 
                        <TableRow><TableCell>   - GELAS_UKUR_50ML : {JSON.parse(el.item).GELAS_UKUR_50ML}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).PIPET_PASTEUR && 
                        <TableRow><TableCell>   - PIPET_PASTEUR : {JSON.parse(el.item).PIPET_PASTEUR}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).ETHANOL_96 && 
                        <TableRow><TableCell>   - ETHANOL_96 : {JSON.parse(el.item).ETHANOL_96}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).MIKROSKOPE && 
                        <TableRow><TableCell>   - MIKROSKOPE : {JSON.parse(el.item).MIKROSKOPE}</TableCell></TableRow>}
                      {!!JSON.parse(el.item).OIL_EMERSION && 
                        <TableRow><TableCell>   - OIL_EMERSION : {JSON.parse(el.item).OIL_EMERSION}</TableCell></TableRow>}
                      
                    </TableBody>
                  </Table>
                )}
              </div>
            }
          </div>
        )}
        </AuthUserContext.Consumer>
      )
    }

}


// this working
const groupBy = (items, key) => items.reduce(
  (result, item) => ({
    ...result,
    [item[key]]: [
      ...(result[item[key]] || []),
      item,
    ],
  }), 
  {},
);

// this working
const groupBy3 = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const condition = authUser => !!authUser;

const SampelAll = withFirebase(SampelAllBase);
// const SampelDetail = withFirebase(SampelDetailBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);