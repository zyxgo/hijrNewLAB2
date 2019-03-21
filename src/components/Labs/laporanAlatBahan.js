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
      this.props.firebase.db.ref('bahanTerpakai')
        // .orderByChild('flagStatusProses')
        // .equalTo('Sampel di Analis')
        .on('value', snap => {
          if(snap.val()) {
            const a = [];
            snap.forEach(el => {
              a.push({
                pengujian: el.val().pengujian,
                AQUADEST: el.val().AQUADEST, 
                PBS_TWEEN: el.val().PBS_TWEEN,
              })
            });

            // const c = groupBy(a, 'pengujian')
            // console.log(c)

            // const d = groupBy3(a, 'pengujian')
            // console.log(d)

            const totals = a.reduce(function (r, o) {
              (r[o.pengujian])? r[o.pengujian] += o.AQUADEST : r[o.pengujian] = o.AQUADEST;
              return r;
            }, {});

            console.log(totals)

            this.setState({ 
              items: snap.val(),
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
    //   console.log(items)
      return (
        <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading ? <Typography>Loading...</Typography> : 
              <div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>AQUADEST</TableCell>
                      <TableCell>BPW</TableCell>
                      <TableCell>CAWAN PETRI</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && !!items && Object.keys(items).map((el, key) => 
                  <TableBody key={key}>
                      <TableRow>
                        <TableCell>{items[el].AQUADEST}</TableCell>
                        <TableCell>{items[el].BPW}</TableCell>
                        <TableCell>{items[el].CAWAN_PETRI}</TableCell>
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