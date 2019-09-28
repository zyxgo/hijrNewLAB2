import React, { Component } from 'react';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import { StyleSheet } from '@react-pdf/renderer';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      // ...props.location.state,
    };
  }

  componentDidMount() {
    // console.log(this.context)
    this.props.firebase.users().on('value', snapshot => {
      this.setState({
        users: snapshot.val(),
      });
    });
    
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    return (
      <Grid style={{ flex: 1, margin: 10 }} item xs={12}>
        <Paper style={{ padding: 10 }}>
          <Typography variant="h5" gutterBottom>
            Selamat datang di aplikasi Sistem Informasi Manajemen Laboratorium
          </Typography>
          <Typography variant="h6" gutterBottom>
            Halaman ini menginformasikan hasil pengujian sample anda.
          </Typography>
          {/* <PDFViewer>
            <Quixote />
          </PDFViewer> */}
        </Paper>
      </Grid>
    );
  }

}

// HomePage.contextType = AuthUserContext


// const styles = StyleSheet.create({
//   body: {
//     padding: 10
//   },
//   table: { 
//     display: "table", 
//     width: "auto", 
//     borderStyle: "solid", 
//     borderColor: '#bfbfbf',
//     borderWidth: 1, 
//     borderRightWidth: 0, 
//     borderBottomWidth: 0 
//   }, 
//   tableRow: { 
//     margin: "auto", 
//     flexDirection: "row" 
//   }, 
//   tableColHeader: { 
//     width: "25%", 
//     borderStyle: "solid", 
//     borderColor: '#bfbfbf',
//     borderBottomColor: '#000',
//     borderWidth: 1, 
//     borderLeftWidth: 0, 
//     borderTopWidth: 0
//   },   
//   tableCol: { 
//     width: "25%", 
//     borderStyle: "solid", 
//     borderColor: '#bfbfbf',
//     borderWidth: 1, 
//     borderLeftWidth: 0, 
//     borderTopWidth: 0 
//   }, 
//   tableCellHeader: {
//     margin: "auto", 
//     // margin: 5, 
//     fontSize: 12,
//     fontWeight: 500
//   },  
//   tableCell: { 
//     margin: "auto", 
//     // margin: 5, 
//     fontSize: 10 
//   }
// });

// const Quixote = () => (
//   <Document>
//     <Page style={styles.body}>
//       <View style={styles.table}> 
//         <View style={styles.tableRow}> 
//           <View style={styles.tableColHeader}> 
//             <Text style={styles.tableCellHeader}>Product</Text> 
//           </View> 
//           <View style={styles.tableColHeader}> 
//             <Text style={styles.tableCellHeader}>Type</Text> 
//           </View> 
//           <View style={styles.tableColHeader}> 
//             <Text style={styles.tableCellHeader}>Period</Text> 
//           </View> 
//           <View style={styles.tableColHeader}> 
//             <Text style={styles.tableCellHeader}>Price</Text> 
//           </View> 
//         </View>
//         <View style={styles.tableRow}> 
//           <View style={styles.tableCol}> 
//             <Text style={styles.tableCell}>React-PDF</Text> 
//           </View> 
//           <View style={styles.tableCol}> 
//             <Text style={styles.tableCell}>3</Text> 
//           </View> 
//           <View style={styles.tableCol}>
//             <Text style={styles.tableCell}>2019-02-20 - 2020-02-19</Text> 
//           </View>
//           <View style={styles.tableCol}> 
//             <Text style={styles.tableCell}>5€</Text> 
//           </View> 
//         </View> 
//         <View style={styles.tableRow}> 
//           <View style={styles.tableCol}> 
//             <Text style={styles.tableCell}>Another row</Text> 
//           </View> 
//           <View style={styles.tableCol}> 
//             <Text style={styles.tableCell}>Capítulo I: Que trata de la condición y ejercicio del famoso hidalgo D.
//         Quijote de la Mancha</Text> 
//           </View> 
//           <View style={styles.tableCol}>
//             <Text style={styles.tableCell}>2019-05-20 - 2020-07-19</Text> 
//           </View>
//           <View style={styles.tableCol}> 
//             <Text style={styles.tableCell}>25€</Text> 
//           </View> 
//         </View>        
//       </View>
//     </Page>
//   </Document>
// );


const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  // withEmailVerification,
  withAuthorization(condition),
)(HomePage);