import React from 'react';
import { BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
// import WilkerPage from '../Wilker';
import Wilker_FormUjiSampel from '../Wilker/formUjiSampel';
// import MasterData from '../MasterData';
import MasterData_Sample from '../MasterData/sample';
import MasterData_Pengujian from '../MasterData/pengujian';
import MasterData_Wilker from '../MasterData/wilker';
import AdminLab from '../Labs/formUjiSampelAdminLab';
import Analis from '../Labs/formUjiSampelAnalis';
import AnalisAlatBahan from '../Labs/laporanAlatBahan';
import MasterData_Bahan from '../MasterData/bahan';
import MasterData_UserForm from '../MasterData/userform';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div>
      <Navigation />
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={ROUTES.WILKER_FORMUJI} component={Wilker_FormUjiSampel} />
      <Route path={ROUTES.MASTERDATASAMPLE} component={MasterData_Sample} />
      <Route path={ROUTES.MASTERDATAPENGUJIAN} component={MasterData_Pengujian} />
      <Route path={ROUTES.MASTERDATA_WILKER} component={MasterData_Wilker} />
      <Route path={ROUTES.MASTERDATA_BAHAN} component={MasterData_Bahan} />
      <Route path={ROUTES.ADMINLAB} component={AdminLab} />
      <Route path={ROUTES.ANALIS} component={Analis} />
      <Route path={ROUTES.ANALIS_ALATBAHAN} component={AnalisAlatBahan} />
      <Route path={ROUTES.MASTERDATA_USERFORM} component={MasterData_UserForm} />
    </div>
  </Router>
);

export default withAuthentication(App);